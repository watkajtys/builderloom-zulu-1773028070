import json
import traceback
from typing import Dict, Any, Optional

import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from .base_agent import BaseAgent
from .io_models import AgentRequest, AgentResponse
from .chain import Node, ExecutionState


class NodeExecutor(BaseAgent):
    """
    Executes a single Node within a Prompt Chain.
    Responsible for:
    1. Interpolating ExecutionState variables into the Node's prompt_template.
    2. Interfacing with the LLM API (google-generativeai) to get the completion.
    3. Returning a standard AgentResponse.
    """

    def __init__(self, node: Node):
        # We initialize with a specific node.
        # It calls the BaseAgent constructor, keeping the node_id in sync for telemetry.
        super().__init__(node_id=node.node_id)
        self.node = node

        # Ensure API key is configured or will be provided later, 
        # normally you'd handle api_key injection via environment or config.
        # But we assume genai.configure() has been called globally, or we pass it here.

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes the prompt node given an ExecutionState.
        The execution state is expected in `request.data['state']`.
        """
        try:
            state_data = request.data.get("state")
            if not state_data:
                raise ValueError("Missing 'state' in request data.")

            # Validate or parse state. Here we assume it's a dict that maps to ExecutionState or an actual ExecutionState object.
            if isinstance(state_data, ExecutionState):
                state = state_data
            else:
                state = ExecutionState(**state_data)

            # 1. Prompt Interpolation
            config = self.node.config or {}
            prompt_template = config.get("prompt_template", "")
            if not prompt_template:
                raise ValueError(f"Node {self.node.node_id} is missing 'prompt_template' in config.")

            try:
                # Basic string formatting.
                prompt = prompt_template.format(**state.variables)
            except KeyError as e:
                raise ValueError(f"Missing variable for interpolation: {e}")

            self._log("DEBUG", "Interpolated prompt", {"prompt": prompt})

            # 2. Interface with LLM
            model_name = config.get("model", "gemini-2.5-flash")
            
            # Additional generation config
            generation_config = config.get("generation_config", {})
            
            # Using generative AI
            model = genai.GenerativeModel(model_name=model_name)
            
            self._log("INFO", f"Calling LLM: {model_name}")
            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            result_text = response.text

            self._log("INFO", "LLM completion successful")

            # 3. Return Standard Output
            return AgentResponse(
                status="success",
                data={"result": result_text}
            )

        except Exception as e:
            error_msg = str(e)
            self._log("ERROR", f"Node execution failed: {error_msg}", {"traceback": traceback.format_exc()})
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg]
            )
