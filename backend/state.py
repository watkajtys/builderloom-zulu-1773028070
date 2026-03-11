import logging
import os
import shutil
import threading
import time
from enum import Enum
from typing import List, Optional
from pathlib import Path
from pydantic import BaseModel, Field
import requests

logger = logging.getLogger("loom")
POCKETBASE_URL = "http://loom-pocketbase:8090"

class TaskPriority(int, Enum):
    P0_CRITICAL = 0
    P1_HIGH = 1
    P2_NORMAL = 2

class TaskType(str, Enum):
    FEATURE = "feature"
    REFACTOR = "refactor"
    BUGFIX = "bugfix"

class BacklogTask(BaseModel):
    id: str
    type: TaskType
    priority: TaskPriority
    complexity: str = "unknown"
    description: str
    target_route: str = "/"
    data_model: Optional[str] = None
    requires_design: bool = True
    test_scenario: str = ""
    context: str = ""
    status: str = "todo"

class AttemptRecord(BaseModel):
    attempt_number: int
    prompt_used: str
    app_screenshot_path: Optional[str] = None
    jules_patch_path: Optional[str] = None
    jules_url: Optional[str] = None
    jules_action: Optional[str] = None
    score: int
    critique: str

class LoopIteration(BaseModel):
    id: int
    timestamp: str
    goal: str
    target_route: str = "/"
    data_model: Optional[str] = None
    requires_design: bool = True
    test_scenario: Optional[str] = None
    negative_history: List[str] = []
    brainstorming_output: Optional[str] = None
    base_briefs: List[str] = []
    base_seed_paths: List[Optional[str]] = []
    base_variants_data: Optional[List[dict]] = None
    seed_review_critique: Optional[str] = None
    design_screenshot_path: Optional[str] = None
    design_variants_paths: List[Optional[str]] = []
    layout_review_critique: Optional[str] = None
    chosen_design_path: Optional[str] = None
    design_review_critique: Optional[str] = None
    theme_variants_paths: List[Optional[str]] = []
    chosen_theme_path: Optional[str] = None
    theme_review_critique: Optional[str] = None
    attempts: List[AttemptRecord] = []
    happiness_score: int = 0  # Final score of this iteration
    successful_branch: Optional[str] = None
    abandoned: bool = False
    architectural_critique: Optional[str] = None
    reflection_learnings: Optional[str] = None
    git_commit: Optional[str] = None

_global_state = None
_state_lock = threading.RLock()
_db_id = "singleton123456"

class ConductorState(BaseModel):
    project_name: str = "Loom Experiment"
    app_meta: str = ""
    product_phase: str = "Phase 1: Core Loop MVP"
    product_roadmap: str = ""
    repo_memory: dict = {}
    current_iteration: int = 0
    active_branch: str = "main"
    
    # Kanban State
    backlog: List[BacklogTask] = []
    active_task_id: Optional[str] = None
    
    # Legacy fields kept temporarily for backward compatibility with in-flight code
    inspiration_goal: str = ""
    inspiration_target_route: str = "/"
    inspiration_data_model: Optional[str] = None
    inspiration_requires_design: bool = True
    inspiration_mode: str = "design"
    inspiration_test_scenario: str = ""
    
    history: List[LoopIteration] = []
    stitch_project_id: Optional[str] = None
    stitch_screen_id: Optional[str] = None
    active_jules_prompt: Optional[str] = None
    active_jules_url: Optional[str] = None
    active_jules_action: Optional[str] = None
    current_status: str = "Idle"
    current_phase: str = "Inspiration"
    pending_steer: List[str] = []
    steering_history: List[dict] = []
    live_logs: List[str] = []
    shutdown_requested: bool = False
    update_scheduled: bool = False
    db_stats: dict = {}
    
    def save(self):
        with _state_lock:
            # First, make sure PocketBase is healthy
            try:
                # We save our entire state model dump
                payload = {"state_data": self.model_dump()}
                # Try to update the singleton record
                update_url = f"{POCKETBASE_URL}/api/collections/conductor_state/records/{_db_id}"
                resp = requests.patch(update_url, json=payload, timeout=2)
                
                if resp.status_code == 404:
                    # Need to create it instead
                    create_url = f"{POCKETBASE_URL}/api/collections/conductor_state/records"
                    payload["id"] = _db_id
                    create_resp = requests.post(create_url, json=payload, timeout=2)
                    if create_resp.status_code >= 400:
                        print(f"Warning: Failed to create state in PocketBase: {create_resp.text}")
                elif resp.status_code >= 400:
                    print(f"Warning: Failed to update state in PocketBase: {resp.text}")
            except Exception as e:
                # Fallback to in-memory only on connection error
                print(f"Warning: PocketBase connection failed during save: {e}")
    
    def add_log(self, log_line: str):
        with _state_lock:
            self.live_logs.append(log_line)
            if len(self.live_logs) > 500:
                self.live_logs = self.live_logs[-500:]
            self.save()

    @classmethod
    def reset(cls):
        """Wipes the in-memory global state and pocketbase."""
        global _global_state
        with _state_lock:
            _global_state = cls(live_logs=[])
            try:
                delete_url = f"{POCKETBASE_URL}/api/collections/conductor_state/records/{_db_id}"
                requests.delete(delete_url, timeout=2)
            except Exception as e:
                print(f"Warning: Failed to reset pocketbase: {e}")
            return _global_state

    @classmethod
    def load(cls) -> 'ConductorState':
        global _global_state
        with _state_lock:
            if _global_state is not None:
                return _global_state
            
            # Fetch from PocketBase
            try:
                fetch_url = f"{POCKETBASE_URL}/api/collections/conductor_state/records/{_db_id}"
                resp = requests.get(fetch_url, timeout=2)
                if resp.status_code == 200:
                    data = resp.json().get("state_data", {})
                    _global_state = cls(**data)
                    return _global_state
            except Exception as e:
                print(f"Warning: Failed to fetch state from PocketBase: {e}")
                
            _global_state = cls()
            return _global_state
