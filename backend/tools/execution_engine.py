from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from enum import Enum


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class Job(BaseModel):
    id: str
    engine: str
    target: str
    status: JobStatus = JobStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ExecutionState(BaseModel):
    job_id: str
    progress: float = 0.0
    message: str = ""
    status: JobStatus = JobStatus.PENDING


class BaseExecutionEngine(ABC):
    """
    Abstract interface for all diagnostic execution engines.
    """
    
    @abstractmethod
    def execute(self, job: Job) -> Job:
        """
        Executes the given job and returns the updated job state.
        """
        pass
    
    @abstractmethod
    def get_status(self, job_id: str) -> ExecutionState:
        """
        Returns the current execution state of a job.
        """
        pass
