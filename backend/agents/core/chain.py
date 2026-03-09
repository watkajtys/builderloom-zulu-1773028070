from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class EdgeType(str, Enum):
    CONDITIONAL = "conditional"
    DIRECT = "direct"

class Edge(BaseModel):
    source: str
    target: str
    edge_type: EdgeType = EdgeType.DIRECT
    condition_key: Optional[str] = None
    condition_value: Optional[str] = None

class Node(BaseModel):
    node_id: str
    agent_type: str
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ExecutionState(BaseModel):
    chain_id: str
    current_node: str
    variables: Dict[str, Any] = Field(default_factory=dict)
    history: List[Dict[str, Any]] = Field(default_factory=list)

class Chain(BaseModel):
    chain_id: str
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
