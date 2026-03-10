import json
import logging
from typing import Dict, Any, Optional
import traceback

import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse

logger = logging.getLogger("loom")

class TaskClassifierAgent(BaseAgent):
    """
    TaskClassifierAgent evaluates a current backlog item (task string)
    and selects the appropriate specialized execution sub-agent intent.
    """
    
    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        
    def execute(self, request: AgentRequest) -> AgentResponse:
        try:
            task_description = request.data.get("task", "")
            
            if not task_description:
                error_msg = "Missing 'task' in request data."
                self._log("ERROR", error_msg, extra_data={"metadata": request.metadata})
                return AgentResponse(
                    status="failure",
                    data={},
                    errors=[error_msg],
                    metadata=request.metadata
                )
            
            # Using prompt interpolation to classify the task
            prompt = f'''
            Evaluate the following task and classify it into one of the specialized execution sub-agent intents.
            Return ONLY a JSON object with the following schema:
            {{
                "intent": "frontend" | "backend"
            }}
            
            Task: "{task_description}"
            '''
            
            self._log("DEBUG", "Generated classification prompt", extra_data={"prompt": prompt, "metadata": request.metadata})
            
            # Use generative AI model to evaluate
            model_name = "gemini-2.5-flash"
            model = genai.GenerativeModel(model_name=model_name)
            
            self._log("INFO", f"Calling LLM: {model_name} for task classification", extra_data={"metadata": request.metadata})
            
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Extract JSON from potential Markdown formatting
            if result_text.startswith("```json"):
                result_text = result_text[7:-3]
            elif result_text.startswith("```"):
                result_text = result_text[3:-3]
                
            try:
                parsed_result = json.loads(result_text)
                intent = parsed_result.get("intent", "unknown")
            except json.JSONDecodeError:
                # Fallback if the LLM didn't return perfect JSON
                intent = "frontend" if "frontend" in result_text.lower() else ("backend" if "backend" in result_text.lower() else "unknown")
                
            self._log("INFO", f"Task classified with intent: {intent}", extra_data={"metadata": request.metadata})
            
            return AgentResponse(
                status="success",
                data={"intent": intent},
                metadata=request.metadata
            )
            
        except Exception as e:
            error_msg = str(e)
            self._log("ERROR", f"Task classification failed: {error_msg}", extra_data={"traceback": traceback.format_exc(), "metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
