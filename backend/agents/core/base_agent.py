import logging
import json
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, Any

from .io_models import AgentRequest, AgentResponse

logger = logging.getLogger("loom")

class BaseAgent(ABC):
    """
    Abstract base class for all Zulu AI Factory OS Sub-Agents.
    Establishes uniform behavior, standard I/O, and telemetry-compliant logging.
    """
    def __init__(self, node_id: str = None):
        self.node_id = node_id or f"NODE-{uuid.uuid4().hex[:6].upper()}"

    def _log(self, level: str, message: str, extra_data: Dict[str, Any] = None):
        """
        Internal logging method to enforce Schema-First Telemetry.
        Mandatory fields: timestamp, node_id, log_level
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "node_id": self.node_id,
            "log_level": level,
            "message": message
        }
        if extra_data:
            log_data.update(extra_data)
            
        # We output this as structured JSON. 
        # Since logger already outputs JSON if we use JSONFormatter, 
        # we can just use the standard logger but ensure our keys are present via `extra`.
        
        # However, to explicitly guarantee the schema even if logger config differs, 
        # we construct the dict and pass it as the message, or rely on extra.
        # Given the memory "Python agent logic must emit standardized JSON objects containing mandatory timestamp, node_id, and log_level fields":
        
        # Log to the standard logger with these fields in `extra`
        # OR just format it as JSON and log it as a string
        log_str = json.dumps(log_data)
        
        if level == "INFO":
            logger.info(log_str)
        elif level == "ERROR":
            logger.error(log_str)
        elif level == "WARN":
            logger.warning(log_str)
        elif level == "DEBUG":
            logger.debug(log_str)
        else:
            logger.info(log_str)


    @abstractmethod
    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Core execution logic for the agent. Must be implemented by subclasses.
        Accepts standard AgentRequest and returns standard AgentResponse.
        """
        pass
