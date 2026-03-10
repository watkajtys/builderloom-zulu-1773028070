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

class FrontendAgent(BaseAgent):
    """
    FrontendAgent specializes in React, Tailwind, and the Zulu AI Factory OS design system.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        
        # System prompt scoped for frontend tasks
        self.system_prompt = '''You are the Frontend Sub-Agent for Zulu AI Factory OS.
Your expertise is strictly scoped to:
1. React
2. Tailwind CSS
3. Zulu AI Factory OS Design System

When providing code or logic, you must strictly adhere to the following rules:
- Base Palette: Deep Obsidian (#050505) and Carbon Surface (#111111)
- Primary Accent: Cyber Cyan (#00F2FF)
- Secondary Accent: Synth Magenta (#BC13FE)
- Neutral: Zinc Grey (#71717a)
- Typography: Geist Sans for Interface, Geist Mono for Data/Telemetry
- Do not provide backend Python scripts or logic.
- Keep your answers concise, providing only the necessary React components or styling logic.
'''

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a frontend-focused task using a generative AI model with the specialized system prompt.
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
            self._log("INFO", f"Executing frontend task", extra_data={"metadata": request.metadata})
            
            # Use generative AI model to evaluate
            model_name = "gemini-2.5-flash"
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=self.system_prompt
            )
            
            response = model.generate_content(task)
            result_text = response.text.strip()
            
            self._log("INFO", f"Frontend task completed successfully", extra_data={"metadata": request.metadata})
            
            return AgentResponse(
                status="success",
                data={"result": result_text},
                metadata=request.metadata
            )
            
        except Exception as e:
            error_msg = str(e)
            self._log("ERROR", f"Frontend task execution failed: {error_msg}", extra_data={"metadata": request.metadata})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
