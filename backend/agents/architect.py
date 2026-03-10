import logging
import os
from typing import Dict, Any, List
from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.utils.react_analyzer import analyze_react_code

logger = logging.getLogger("loom")

class ArchitectAgent(BaseAgent):
    """
    ArchitectAgent runs static analysis on a given file using analyze_react_code utility wrapper
    and penalizes an initial base score based on the number of linting issues found.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)

    def execute(self, request: AgentRequest) -> AgentResponse:
        """
        Executes static analysis and applies a mathematical penalty to the base score.
        
        request.data requires:
        - "filepath": str (the file to analyze)
        - "base_score": float (the starting score to penalize, e.g. 10.0)
        - "penalty_per_issue": float (the amount to deduct per issue, e.g. 1.0)
        """
        filepath = request.data.get("filepath")
        base_score = float(request.data.get("base_score", 10.0))
        penalty_per_issue = float(request.data.get("penalty_per_issue", 1.0))

        if not filepath:
            self._log("ERROR", "Missing 'filepath' in AgentRequest data.")
            return AgentResponse(
                status="failure",
                data={"score": base_score},
                errors=["Missing 'filepath' in request data."]
            )

        self._log("INFO", f"Starting static analysis on {filepath}")
        
        if not os.path.exists(filepath):
            self._log("ERROR", f"File not found: {filepath}")
            return AgentResponse(
                status="failure",
                data={"score": base_score},
                errors=[f"File not found: {filepath}"]
            )

        with open(filepath, "r", encoding="utf-8") as f:
            code_str = f.read()
        
        # Run analyze_react_code wrapper
        analysis_result = analyze_react_code(code_str)
        
        issues = analysis_result.get("issues", [])
        
        # Calculate new score
        num_issues = len(issues)
        total_penalty = num_issues * penalty_per_issue
        final_score = max(0.0, base_score - total_penalty)

        self._log(
            "INFO", 
            f"Static analysis complete. Found {num_issues} issues. Base score {base_score} -> {final_score}",
            extra_data={"issues": issues, "penalized_score": final_score}
        )

        return AgentResponse(
            status="success" if num_issues == 0 else "issues_found",
            data={
                "score": final_score,
                "issues": issues,
                "static_violations": issues,
                "filepath": filepath
            }
        )
