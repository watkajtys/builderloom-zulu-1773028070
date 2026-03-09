import json
from typing import Optional
from pocketbase import PocketBase
from .execution_engine import Job, JobStatus

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
            return self.pb.collection("execution_jobs").create(data)

    def get_job(self, job_id: str) -> Optional[Job]:
        try:
            record = self.pb.collection("execution_jobs").get_first_list_item(f"job_id='{job_id}'")
            result = None
            if record.result:
                try:
                    result = json.loads(record.result)
                except Exception:
                    pass
            return Job(
                id=record.job_id,
                engine=record.engine,
                target=record.target,
                status=record.status,
                result=result,
                error=record.error if record.error else None
            )
        except Exception:
            return None
