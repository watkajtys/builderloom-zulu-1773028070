import json
from typing import Optional
from pocketbase import PocketBase
from .chain import Chain, ExecutionState

class ChainStore:
    def __init__(self, pb_url: str = "http://loom-pocketbase:8090"):
        self.pb = PocketBase(pb_url)

    def save_chain(self, chain: Chain) -> dict:
        data = {
            "chain_id": chain.chain_id,
            "nodes": json.dumps([node.model_dump() for node in chain.nodes]),
            "edges": json.dumps([edge.model_dump() for edge in chain.edges])
        }
        
        try:
            # Check if chain exists
            existing = self.pb.collection("chains").get_first_list_item(f"chain_id='{chain.chain_id}'")
            return self.pb.collection("chains").update(existing.id, data)
        except Exception:
            # If not found or error, try creating
            return self.pb.collection("chains").create(data)

    def get_chain(self, chain_id: str) -> Optional[Chain]:
        try:
            record = self.pb.collection("chains").get_first_list_item(f"chain_id='{chain_id}'")
            return Chain(
                chain_id=record.chain_id,
                nodes=json.loads(record.nodes),
                edges=json.loads(record.edges)
            )
        except Exception:
            return None

    def save_execution_state(self, state: ExecutionState) -> dict:
        data = {
            "chain_id": state.chain_id,
            "current_node": state.current_node,
            "variables": json.dumps(state.variables),
            "history": json.dumps(state.history)
        }
        
        try:
            existing = self.pb.collection("execution_states").get_first_list_item(f"chain_id='{state.chain_id}'")
            return self.pb.collection("execution_states").update(existing.id, data)
        except Exception:
            return self.pb.collection("execution_states").create(data)

    def get_execution_state(self, chain_id: str) -> Optional[ExecutionState]:
        try:
            record = self.pb.collection("execution_states").get_first_list_item(f"chain_id='{chain_id}'")
            return ExecutionState(
                chain_id=record.chain_id,
                current_node=record.current_node,
                variables=json.loads(record.variables),
                history=json.loads(record.history)
            )
        except Exception:
            return None
