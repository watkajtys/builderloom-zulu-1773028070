from dataclasses import dataclass, field
from typing import Any, Dict, Optional
import uuid
from datetime import datetime

@dataclass
class AgentRequest:
    """
    Standard incoming payload structure for Sub-Agents.
    Ensures tasks are uniformly passed and trackable.
    """
    task_id: str
    data: Dict[str, Any]
    context: Optional[Dict[str, Any]] = field(default_factory=dict)
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)
    
@dataclass
class AgentResponse:
    """
    Standard output structure for Sub-Agents.
    Ensures agent outputs conform to expected schema for pipeline routing.
    """
    status: str  # e.g., "success", "failure", "partial"
    data: Dict[str, Any]
    errors: Optional[list] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)
