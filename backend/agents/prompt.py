import sys
import os
import json
import traceback
import logging
from typing import Dict, Any, Optional

import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.agents.core.chain import ExecutionState, Node

logger = logging.getLogger("loom")

class PromptAgent(BaseAgent):
    """
    PromptAgent executes a single Node within a Prompt Chain.
    Responsible for:
    1. Interpolating ExecutionState variables into the Node's prompt_template.
    2. Interfacing with the LLM API (google-generativeai) to get the completion.
    3. Returning a standard AgentResponse.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes the prompt node given an ExecutionState and Node definition.
        
        request.data requires:
        - "state": dict (ExecutionState model dump)
        - "node": dict (Node model dump)
        """
        try:
            state_data = request.data.get("state")
            node_data = request.data.get("node")
            
            if not state_data:
                error_msg = "Missing 'state' in request data."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(status="failure", data={}, errors=[error_msg], metadata=request.metadata)
                
            if not node_data:
                error_msg = "Missing 'node' in request data."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(status="failure", data={}, errors=[error_msg], metadata=request.metadata)

            # Validate or parse state and node
            if isinstance(state_data, ExecutionState):
                state = state_data
            else:
                state = ExecutionState(**state_data)
                
            if isinstance(node_data, Node):
                node = node_data
            else:
                node = Node(**node_data)

            # Keep node_id in sync for telemetry
            self.node_id = node.node_id

            # 1. Prompt Interpolation
            config = node.config or {}
            prompt_template = config.get("prompt_template", "")
            if not prompt_template:
                error_msg = f"Node {node.node_id} is missing 'prompt_template' in config."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(status="failure", data={}, errors=[error_msg], metadata=request.metadata)

            try:
                # Basic string formatting.
                prompt = prompt_template.format(**state.variables)
            except KeyError as e:
                error_msg = f"Missing variable for interpolation: {e}"
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(status="failure", data={}, errors=[error_msg], metadata=request.metadata)

            self._emit_json_log("DEBUG", "Interpolated prompt", extra_data={"prompt": prompt}, metadata=request.metadata)

            # 2. Interface with LLM
            model_name = config.get("model", "gemini-2.5-flash")
            
            # Additional generation config
            generation_config = config.get("generation_config", {})
            
            # Using generative AI
            model = genai.GenerativeModel(model_name=model_name)
            
            self._emit_json_log("INFO", f"Calling LLM: {model_name}", metadata=request.metadata)
            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            result_text = response.text

            self._emit_json_log("INFO", "LLM completion successful", metadata=request.metadata)

            # 3. Return Standard Output
            return AgentResponse(
                status="success",
                data={"result": result_text},
                metadata=request.metadata
            )

        except Exception as e:
            error_msg = str(e)
            self._emit_json_log("ERROR", f"Node execution failed: {error_msg}", extra_data={"traceback": traceback.format_exc()}, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
