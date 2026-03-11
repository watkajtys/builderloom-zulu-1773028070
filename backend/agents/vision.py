import sys
import os
import json
import logging
import warnings
from typing import Dict, Any, List

# Suppress deprecation warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from google.api_core import exceptions
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Ensure we can import from core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse

logger = logging.getLogger("loom")

class VisionAgent(BaseAgent):
    """
    VisionAgent performs temporal visual analysis of the UI over a series of frames.
    It accepts an array of the last N images and compares the timeline specifically looking
    for unintended deletions of working UI elements (the 'Bulldozer Problem').
    """
    
    def __init__(self, node_id: str = None, model_name: str = 'gemini-2.5-flash'):
        super().__init__(node_id=node_id)
        self.model = genai.GenerativeModel(model_name)

    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=1, min=2, max=60),
        retry=(
            retry_if_exception_type(exceptions.DeadlineExceeded) |
            retry_if_exception_type(exceptions.ServiceUnavailable) |
            retry_if_exception_type(exceptions.InternalServerError) |
            retry_if_exception_type(exceptions.ResourceExhausted)
        ),
        reraise=True
    )
    def _generate_content_with_retry(self, content):
        """Helper to call Gemini with robust exponential backoff retries."""
        try:
            self._log("INFO", f"Sending request to Vision ({self.model.model_name})...")
            return self.model.generate_content(content, request_options={"timeout": 120})
        except Exception as e:
            self._log("WARN", f"Vision Gemini call failed (attempting retry): {e}")
            raise

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a temporal visual analysis.
        
        request.data requires:
        - "images": Dict[str, bytes] (mapping 'T-5', 'T-1', 'Current' to image data)
        - "inspiration_goal": str (optional context of what is being built)
        """
        images = request.data.get("images", {})
        inspiration_goal = request.data.get("inspiration_goal", "UI Component Evolution")
        
        if not images or not isinstance(images, dict):
            self._log("ERROR", "Missing or invalid 'images' dictionary in AgentRequest data.")
            return AgentResponse(
                status="failure",
                data={},
                errors=["Missing or invalid 'images' dictionary in request data. Must be a dictionary mapping frame names to image data."]
            )
            
        # Ensure we have at least 'Current' and one historical frame
        valid_keys = [k for k, v in images.items() if v is not None]
        if 'Current' not in valid_keys or len(valid_keys) < 2:
            self._log("INFO", f"Insufficient frames ({valid_keys}) provided with valid image data, temporal comparison skipped.")
            return AgentResponse(
                status="success",
                data={"regression_detected": False, "reason": "Insufficient frames for timeline comparison."}
            )

        self._log("INFO", f"Starting temporal visual analysis across frames: {', '.join(valid_keys)}.")
        
        prompt = [
            f"You are the Vision Agent for Zulu AI Factory OS. Your goal was: '{inspiration_goal}'.\n",
            "You are reviewing a chronological timeline of UI screenshots (T-5, T-1, Current).\n",
            "CRITICAL TASK: Analyze the timeline specifically looking for the 'Bulldozer Problem'—the unintended deletion or breaking of previously working UI elements in the final frame (Current) compared to earlier frames (T-5 and T-1).\n",
            "Rules:\n",
            "1. Ignore minor layout shifts or intended replacements.\n",
            "2. Flag a critical regression ONLY IF a clear functional element (like a button, panel, or graph) was present in earlier frames (T-5 or T-1) but is inexplicably missing or broken in the Current frame.\n",
            "3. Evaluate 'object permanence' across the timeline. Severely penalize UI changes that unnecessarily destroy previously working elements.\n",
            "4. Provide your assessment in strict JSON format with two keys: 'regression_detected' (boolean) and 'reason' (string).\n",
            "Output ONLY the JSON object, nothing else."
        ]
        
        content = [*prompt]
        for key in valid_keys:
            img_data = images[key]
            content.append(f"Frame {key}:")
            if isinstance(img_data, bytes):
                content.append({"mime_type": "image/png", "data": img_data})
            elif isinstance(img_data, str):
                import base64
                try:
                    decoded = base64.b64decode(img_data)
                    content.append({"mime_type": "image/png", "data": decoded})
                except Exception as e:
                    self._log("WARN", f"Failed to decode base64 image at {key}: {e}")
            else:
                self._log("WARN", f"Unrecognized image format at {key}.")
                
        try:
            response = self._generate_content_with_retry(content)
            result_text = response.text.strip()
            
            # Clean up markdown JSON formatting if present
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]
                
            result_json = json.loads(result_text.strip())
            
            regression_detected = result_json.get("regression_detected", False)
            reason = result_json.get("reason", "No reason provided.")
            
            status = "issues_found" if regression_detected else "success"
            
            self._log(
                "INFO", 
                f"Temporal analysis complete. Regression detected: {regression_detected}. Reason: {reason}",
                extra_data={"regression_detected": regression_detected}
            )
            
            return AgentResponse(
                status=status,
                data={
                    "regression_detected": regression_detected,
                    "reason": reason,
                    "frames_analyzed": len(valid_keys)
                }
            )
            
        except json.JSONDecodeError as e:
            self._log("ERROR", f"Failed to parse Vision Agent response as JSON: {response.text}")
            return AgentResponse(
                status="failure",
                data={"raw_response": response.text},
                errors=["Invalid JSON response from vision model."]
            )
        except Exception as e:
            self._log("ERROR", f"Vision Agent temporal analysis failed: {str(e)}")
            return AgentResponse(
                status="failure",
                data={},
                errors=[f"Temporal analysis failed: {str(e)}"]
            )
