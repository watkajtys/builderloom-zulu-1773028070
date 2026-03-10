import json
import logging
from datetime import datetime
from typing import Optional
from pocketbase import PocketBase
from .execution_engine import Job, JobStatus

logger = logging.getLogger("loom")

def _emit_json_log(level: str, message: str, node_id: str = "execution_store"):
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "node_id": node_id,
        "log_level": level,
        "message": message
    }
    if level == "ERROR":
        logger.error(json.dumps(log_data))
    else:
        logger.info(json.dumps(log_data))

class ExecutionStore:
    def __init__(self, pb_url: str = "http://loom-pocketbase:8090"):
        self.pb = PocketBase(pb_url)

    def save_job(self, job: Job) -> dict:
        data = {
            "job_id": job.id,
            "engine": job.engine,
            "target": job.target,
            "status": job.status,
            "result": json.dumps(job.result) if job.result is not None else "",
            "error": job.error or ""
        }
        try:
            existing = self.pb.collection("execution_jobs").get_first_list_item(f"job_id='{job.id}'")
            return self.pb.collection("execution_jobs").update(existing.id, data)
        except Exception:
            # If not found or error, try creating
            try:
                return self.pb.collection("execution_jobs").create(data)
            except Exception as e:
                _emit_json_log("ERROR", f"Failed to save job {job.id}: {e}")
                raise

    def get_job(self, job_id: str) -> Optional[Job]:
        try:
            record = self.pb.collection("execution_jobs").get_first_list_item(f"job_id='{job_id}'")
            result = None
            if record.result:
                try:
                    result = json.loads(record.result)
                except Exception as e:
                    _emit_json_log("ERROR", f"Failed to parse result for job {job_id}: {e}")
            return Job(
                id=record.job_id,
                engine=record.engine,
                target=record.target,
                status=record.status,
                result=result,
                error=record.error if record.error else None
            )
        except Exception as e:
            _emit_json_log("ERROR", f"Failed to get job {job_id}: {e}")
            return None
