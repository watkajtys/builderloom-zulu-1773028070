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

class BackendAgent(BaseAgent):
    """
    BackendAgent specializes in Python, PocketBase SDK, and JSON structured logging.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        
        # System prompt scoped for backend tasks
        self.system_prompt = '''You are the Backend Sub-Agent for Zulu AI Factory OS.
Your expertise is strictly scoped to:
1. Python
2. PocketBase SDK (for Python)
3. JSON structured logging

When providing code or logic, you must strictly adhere to the following rules:
- Only use standard Python library modules unless specifically requested.
- Use the official Python PocketBase SDK for database operations.
- Ensure all logging statements use a JSON structured format with timestamp, node_id, log_level, and message fields.
- Do not provide frontend code (React, HTML, CSS).
- Keep your answers concise, providing only the necessary code or logic.
'''

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a backend-focused task using a generative AI model with the specialized system prompt.
        """
        task = request.data.get("task")
        
        if not task:
            error_msg = "Missing 'task' in request data."
            self._log("ERROR", error_msg, extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
        
        try:
            self._log("INFO", f"Executing backend task", extra_data={"metadata": request.metadata})
            
            # Use generative AI model to evaluate
            model_name = "gemini-2.5-flash"
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=self.system_prompt
            )
            
            response = model.generate_content(task)
            result_text = response.text.strip()
            
            self._log("INFO", f"Backend task completed successfully", extra_data={"metadata": request.metadata})
            
            return AgentResponse(
                status="success",
                data={"result": result_text},
                metadata=request.metadata
            )
            
        except Exception as e:
            error_msg = str(e)
            self._log("ERROR", f"Backend task execution failed: {error_msg}", extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
