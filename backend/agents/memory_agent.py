import logging
import json
from typing import Dict, Any, List
from datetime import datetime
import traceback

import pocketbase
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse

logger = logging.getLogger("loom")

class MemoryAgent(BaseAgent):
    """
    MemoryAgent acts as a garbage collector for the context window.
    It identifies obsolete patterns, retains strict rules, and formats a dense block
    to prevent context amnesia.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        
        self.system_prompt = '''You are the Repo Memory Compression Sub-Agent.
Your job is to condense a list of redundant architectural learnings into a single, highly dense context block.
You MUST retain critical, strict architectural constraints (e.g., "NO ORMs", "use window.location.hostname:8090", "use http://loom-pocketbase:8090", "Atomic Domain Isolation", "NO local file-based persistence").
Discard irrelevant fluff, obsolete patterns, or redundant narratives.
Output ONLY the condensed, highly dense text block. No pleasantries, no markdown blocks, just the raw condensed text.
'''

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes a memory compression task using a generative AI model.
        """
        try:
            self._emit_json_log("INFO", "Executing memory compression task", metadata=request.metadata)
            
            # Fetch repo_memory from PocketBase
            # Try to get pocketbase URL from environment, or use default localhost
            import os
            pb_url = os.environ.get("POCKETBASE_URL", "http://127.0.0.1:8090")
            pb = pocketbase.PocketBase(pb_url)
            
            learnings = request.data.get("learnings", [])
            record_id = None
            
            try:
                records = pb.collection('repo_memory').get_full_list()
                if records and len(records) > 0:
                    record = records[0]
                    record_id = record.id
                    
                    # Merge existing raw_learnings with new learnings
                    existing_learnings = record.raw_learnings
                    if existing_learnings:
                        # Assuming it's a JSON string of array, or plain text
                        try:
                            parsed_existing = json.loads(existing_learnings)
                            if isinstance(parsed_existing, list):
                                learnings = parsed_existing + learnings
                            else:
                                learnings.insert(0, existing_learnings)
                        except json.JSONDecodeError:
                            learnings.insert(0, existing_learnings)
            except Exception as e:
                self._emit_json_log("WARN", f"Could not fetch repo_memory records: {str(e)}", metadata=request.metadata)
            
            if not isinstance(learnings, list) or not learnings:
                error_msg = "No learnings available to compress."
                self._emit_json_log("WARN", error_msg, metadata=request.metadata)
                return AgentResponse(
                    status="success",
                    data={"compressed_context": ""},
                    metadata=request.metadata
                )
            
            # Format learnings into a string for the prompt
            learnings_text = "\\n- ".join(learnings)
            task_prompt = f"Condense the following architectural learnings:\\n- {learnings_text}"
            
            # Use generative AI model to evaluate
            model_name = "gemini-2.5-flash"
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=self.system_prompt
            )
            
            model_resp = model.generate_content(task_prompt)
            result_text = model_resp.text.strip()
            
            # Persist compressed_context to PocketBase
            current_utc = datetime.utcnow().isoformat() + "Z"
            update_data = {
                "compressed_context": result_text,
                "last_compressed_at": current_utc,
                "raw_learnings": "" # Clear raw learnings after compression
            }
            
            try:
                if record_id:
                    pb.collection('repo_memory').update(record_id, update_data)
                else:
                    pb.collection('repo_memory').create(update_data)
            except Exception as e:
                self._emit_json_log("WARN", f"Could not update repo_memory records: {str(e)}", metadata=request.metadata)
            
            self._emit_json_log("INFO", "Memory compression task completed successfully", metadata=request.metadata)
            
            return AgentResponse(
                status="success",
                data={"compressed_context": result_text},
                metadata=request.metadata
            )
            
        except Exception as e:
            error_msg = str(e)
            self._emit_json_log("ERROR", f"Memory compression task failed: {error_msg}", extra_data={"traceback": traceback.format_exc()}, metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={},
                errors=[error_msg],
                metadata=request.metadata
            )
