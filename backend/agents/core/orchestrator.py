from typing import Dict, Any, Optional
import uuid
import logging
from .chain import Chain, ExecutionState, EdgeType
from .chain_store import ChainStore
from .node_executor import NodeExecutor
from .io_models import AgentRequest, AgentResponse
import dataclasses

logger = logging.getLogger("loom")

class ChainOrchestrator:
    def __init__(self, chain: Chain, store: ChainStore = None):
        self.chain = chain
        self.store = store
        self.nodes_by_id = {node.node_id: node for node in chain.nodes}
        self.edges_by_source = {}
        for edge in chain.edges:
            if edge.source not in self.edges_by_source:
                self.edges_by_source[edge.source] = []
            self.edges_by_source[edge.source].append(edge)

    def run(self, initial_state: ExecutionState) -> ExecutionState:
        state = initial_state
        
        while state.current_node:
            current_node = self.nodes_by_id.get(state.current_node)
            if not current_node:
                logger.error(f"Node {state.current_node} not found in chain {self.chain.chain_id}")
                break

            executor = NodeExecutor(current_node)
            request = AgentRequest(
                task_id=str(uuid.uuid4()),
                data={"state": state.model_dump()}
            )
            
            response = executor.execute(request)
            
            # Store history
            state.history.append({
                "node_id": state.current_node,
                "request": dataclasses.asdict(request),
                "response": dataclasses.asdict(response)
            })

            if response.status != "success":
                logger.error(f"Execution failed at node {state.current_node}: {response.errors}")
                break

            # Add result to variables. We use the node_id to namespace the output,
            # and also store it as 'latest_output' for convenience.
            result = response.data.get("result")
            state.variables[f"{state.current_node}_output"] = result
            state.variables["latest_output"] = result
            
            # Find next node
            outgoing_edges = self.edges_by_source.get(state.current_node, [])
            next_node = None

            for edge in outgoing_edges:
                if edge.edge_type == EdgeType.DIRECT:
                    next_node = edge.target
                    break
                elif edge.edge_type == EdgeType.CONDITIONAL:
                    # Simple conditional evaluation
                    val = state.variables.get(edge.condition_key)
                    if val == edge.condition_value:
                        next_node = edge.target
                        break

            state.current_node = next_node

            if self.store:
                self.store.save_execution_state(state)

        return state
