import logging
import json
from typing import Dict, Any

import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse

logger = logging.getLogger("loom")

class RefactorAgent(BaseAgent):
    """
    RefactorAgent is tasked purely with digesting static analysis violations (Pylint/ESLint)
    and generating targeted code patches or refactored files.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        
        self.system_prompt = '''You are the Refactor Sub-Agent for Zulu AI Factory OS.
Your ONLY purpose is to digest static analysis violations (e.g., Pylint, ESLint) and generate targeted code patches.
You are strictly scoped to fixing code based on provided issues.
Ensure all logging statements use a JSON structured format with timestamp, node_id, log_level, and message fields.

Input will contain:
1. The original source code.
2. A list of static analysis issues/violations.

Output constraints:
- Return ONLY the exact code change (diff or full corrected code) to fix the issues.
- Do NOT include any conversational text or markdown formatting outside of code blocks.
- If removing an unused import, provide the code without that import.
'''

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a refactoring task based on code and issues.
        """
        code = request.data.get("code")
        issues = request.data.get("issues")
        
        if not code:
            error_msg = "Missing 'code' in request data."
            self._log("ERROR", error_msg, extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
            
        if issues is None:
            error_msg = "Missing 'issues' in request data."
            self._log("ERROR", error_msg, extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
        
        try:
            self._log("INFO", "Executing refactor task", extra_data={"metadata": request.metadata})
            
            prompt = f"""
            Fix the following issues in the provided code.

            ISSUES:
            {json.dumps(issues, indent=2)}

            ORIGINAL CODE:
            {code}
            """

            # Use generative AI model to evaluate
            model_name = "gemini-2.5-flash"
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=self.system_prompt
            )
            
            response = model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Clean up markdown code blocks if present
            if result_text.startswith("```python"):
                result_text = result_text[9:-3].strip()
            elif result_text.startswith("```javascript"):
                result_text = result_text[13:-3].strip()
            elif result_text.startswith("```typescript"):
                result_text = result_text[13:-3].strip()
            elif result_text.startswith("```"):
                result_text = result_text[3:-3].strip()
            
            self._log("INFO", "Refactor task completed successfully", extra_data={"metadata": request.metadata})
            
            return AgentResponse(
                status="success",
                data={"result": result_text},
                metadata=request.metadata
            )
            
        except Exception as e:
            error_msg = str(e)
            self._log("ERROR", f"Refactor task execution failed: {error_msg}", extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
