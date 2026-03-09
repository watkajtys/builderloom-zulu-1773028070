import logging
import uuid
from typing import Dict, List, Optional

from .execution_engine import BaseExecutionEngine, ExecutionState, Job, JobStatus
from .execution_store import ExecutionStore

logger = logging.getLogger("loom")

class Orchestrator:
    def __init__(self, store: Optional[ExecutionStore] = None):
        self.engines: Dict[str, BaseExecutionEngine] = {}
        self.queue: List[str] = []
        self.store = store
        self.jobs: Dict[str, Job] = {} # In-memory fallback

    def register_engine(self, name: str, engine: BaseExecutionEngine):
        self.engines[name] = engine

    def submit_job(self, engine: str, target: str) -> str:
        job_id = str(uuid.uuid4())
        job = Job(id=job_id, engine=engine, target=target, status=JobStatus.PENDING)

        self.queue.append(job_id)
        self._save_job(job)
        return job_id

    def get_job(self, job_id: str) -> Optional[Job]:
        if self.store:
            return self.store.get_job(job_id)
        return self.jobs.get(job_id)

    def get_job_status(self, job_id: str) -> Optional[ExecutionState]:
        job = self.get_job(job_id)
        if not job:
            return None

        engine_impl = self.engines.get(job.engine)
        if engine_impl and job.status == JobStatus.RUNNING:
            return engine_impl.get_status(job_id)

        return ExecutionState(
            job_id=job.id,
            status=job.status,
            message="Queued" if job.status == JobStatus.PENDING else "Done",
            progress=0.0 if job.status == JobStatus.PENDING else 100.0
        )

    def process_queue(self):
        """Processes all pending jobs in the queue synchronously."""
        while self.queue:
            job_id = self.queue.pop(0)
            self.run_job(job_id)

    def run_job(self, job_id: str):
        job = self.get_job(job_id)
        if not job:
            logger.error(f"Job {job_id} not found.")
            return

        engine_impl = self.engines.get(job.engine)
        if not engine_impl:
            job.status = JobStatus.FAILED
            job.error = f"Engine '{job.engine}' not registered."
            self._save_job(job)
            return

        job.status = JobStatus.RUNNING
        self._save_job(job)

        try:
            updated_job = engine_impl.execute(job)
            self._save_job(updated_job)
        except Exception as e:
            logger.error(f"Error executing job {job_id}: {e}")
            job.status = JobStatus.FAILED
            job.error = str(e)
            self._save_job(job)

    def _save_job(self, job: Job):
        if self.store:
            self.store.save_job(job)
        else:
            self.jobs[job.id] = job
