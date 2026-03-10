import logging
from typing import Dict, Any, Optional

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.agents.vision import VisionAgent
from backend.agents.architect import ArchitectAgent

logger = logging.getLogger("loom")

class RouterAgent(BaseAgent):
    """
    RouterAgent dispatches tasks to the appropriate sub-agents based on the task_type.
    """
    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        # We can instantiate sub-agents lazily or upfront. For simplicity, we can do it lazily
        # or just instantiate them here.
        self.vision_agent = VisionAgent(node_id=f"{self.node_id}-VISION")
        self.architect_agent = ArchitectAgent(node_id=f"{self.node_id}-ARCHITECT")

    def execute(self, request: AgentRequest) -> AgentResponse:
        task_type = request.data.get("task_type")
        
        self._emit_json_log("INFO", f"Routing task of type '{task_type}'", metadata=request.metadata)

        if not task_type:
            error_msg = "Missing 'task_type' in request data."
            self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )

        if task_type == "vision":
            return self.vision_agent.execute(request)
        elif task_type == "architect":
            return self.architect_agent.execute(request)
        else:
            error_msg = f"Unknown task_type '{task_type}'."
            self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
