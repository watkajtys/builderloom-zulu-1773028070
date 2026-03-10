import logging
from typing import Dict, Any, Optional

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.tools.orchestrator import Orchestrator
from backend.tools.execution_store import ExecutionStore
from backend.tools.execution_engine import BaseExecutionEngine

logger = logging.getLogger("loom")

class ExecutorAgent(BaseAgent):
    """
    ExecutorAgent acts as a bridge between the AgentRequest IO model
    and the underlying job execution queue (Orchestrator).
    """

    def __init__(self, node_id: str = None, pb_url: str = "http://loom-pocketbase:8090"):
        super().__init__(node_id=node_id)
        self.store = ExecutionStore(pb_url=pb_url)
        self.orchestrator = Orchestrator(store=self.store)

    def register_engine(self, name: str, engine: BaseExecutionEngine):
        """Registers a BaseExecutionEngine to the internal Orchestrator."""
        self.orchestrator.register_engine(name, engine)

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a job submission or status retrieval command.
        
        request.data requires:
        - "command": str ("submit_job" or "get_status")
        - for "submit_job": "engine" (str), "target" (str)
        - for "get_status": "job_id" (str)
        """
        command = request.data.get("command")
        
        if not command:
            error_msg = "Missing 'command' in AgentRequest data."
            self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
            
        if command == "submit_job":
            engine = request.data.get("engine")
            target = request.data.get("target")
            
            if not engine or not target:
                error_msg = "Missing 'engine' or 'target' for 'submit_job' command."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(
                    status="failure",
                    data={},
                    errors=[error_msg],
                    metadata=request.metadata
                )
                
            self._emit_json_log("INFO", f"Submitting job to engine '{engine}' with target '{target}'", metadata=request.metadata)
            job_id = self.orchestrator.submit_job(engine, target)
            
            return AgentResponse(
                status="success",
                data={"job_id": job_id},
                metadata=request.metadata
            )
            
        elif command == "get_status":
            job_id = request.data.get("job_id")
            
            if not job_id:
                error_msg = "Missing 'job_id' for 'get_status' command."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(
                    status="failure",
                    data={},
                    errors=[error_msg],
                    metadata=request.metadata
                )
                
            self._emit_json_log("INFO", f"Retrieving status for job '{job_id}'", metadata=request.metadata)
            
            # Use the orchestrator method to get the ExecutionState
            execution_state = self.orchestrator.get_job_status(job_id)
            
            if not execution_state:
                error_msg = f"Job '{job_id}' not found."
                self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
                return AgentResponse(
                    status="failure",
                    data={},
                    errors=[error_msg],
                    metadata=request.metadata
                )
            
            return AgentResponse(
                status="success",
                data={"execution_state": execution_state.model_dump()},
                metadata=request.metadata
            )
            
        else:
            error_msg = f"Unknown command '{command}'."
            self._emit_json_log("ERROR", error_msg, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
