import logging
from typing import Dict, Any, Optional

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.agents.vision import VisionAgent
from backend.agents.architect import ArchitectAgent
from backend.agents.python_architect import PythonArchitectAgent
from backend.agents.executor import ExecutorAgent
from backend.agents.prompt import PromptAgent
from backend.agents.router_agent import TaskClassifierAgent
from backend.agents.backend_agent import BackendAgent
from backend.agents.refactor_agent import RefactorAgent
from backend.agents.frontend_agent import FrontendAgent
from backend.agents.memory_agent import MemoryAgent

logger = logging.getLogger("loom")

class RouterAgent(BaseAgent):
    """
    RouterAgent dispatches tasks to the appropriate sub-agents based on the task_type.
    Uses Schema-Validated Intent Routing to dispatch tasks to dynamically registered sub-agents.
    """
    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        # Registry for decoupled capability registration
        self._registry: Dict[str, BaseAgent] = {}
        
        # Pre-register default agents
        self.register_agent("vision", VisionAgent(node_id=f"{self.node_id}-VISION"))
        self.register_agent("architect", ArchitectAgent(node_id=f"{self.node_id}-ARCHITECT"))
        self.register_agent("python_architect", PythonArchitectAgent(node_id=f"{self.node_id}-PYTHON-ARCHITECT"))
        self.register_agent("executor", ExecutorAgent(node_id=f"{self.node_id}-EXECUTOR"))
        self.register_agent("prompt", PromptAgent(node_id=f"{self.node_id}-PROMPT"))
        self.register_agent("classifier", TaskClassifierAgent(node_id=f"{self.node_id}-CLASSIFIER"))
        self.register_agent("backend", BackendAgent(node_id=f"{self.node_id}-BACKEND"))
        self.register_agent("refactor", RefactorAgent(node_id=f"{self.node_id}-REFACTOR"))
        self.register_agent("frontend", FrontendAgent(node_id=f"{self.node_id}-FRONTEND"))
        self.register_agent("memory", MemoryAgent(node_id=f"{self.node_id}-MEMORY"))

    def register_agent(self, task_type: str, agent: BaseAgent):
        """Registers a sub-agent to handle a specific task_type."""
        self._registry[task_type] = agent

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

        target_agent = self._registry.get(task_type)
        if target_agent:
            return target_agent.execute(request)
        else:
            error_msg = f"Unknown task_type '{task_type}'."
            self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
