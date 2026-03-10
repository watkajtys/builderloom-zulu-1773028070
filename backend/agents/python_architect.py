import logging
from typing import Dict, Any, List
from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
from backend.tools.python_analyzer import PythonAnalyzer

logger = logging.getLogger("loom")

class PythonArchitectAgent(BaseAgent):
    """
    PythonArchitectAgent runs static analysis on a given file using PythonAnalyzer (Ruff)
    and penalizes an initial base score based on the number of linting issues found.
    """

    def __init__(self, node_id: str = None):
        super().__init__(node_id=node_id)
        self.analyzer = PythonAnalyzer()

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
            self._emit_json_log("ERROR", "Missing 'filepath' in AgentRequest data.", metadata=request.metadata)
            return AgentResponse(
                status="failure",
                data={"score": base_score},
                errors=["Missing 'filepath' in request data."],
                metadata=request.metadata
            )

        self._emit_json_log("INFO", f"Starting static analysis on {filepath}", metadata=request.metadata)
        
        # Run PythonAnalyzer
        analysis_result = self.analyzer.analyze_file(filepath)
        
        status = analysis_result.get("status", "error")
        issues = analysis_result.get("issues", [])
        
        # Emit telemetry
        if status == "error":
            error_msg = analysis_result.get("message", "Unknown error during static analysis.")
            self._emit_json_log("ERROR", f"Static analysis failed: {error_msg}", metadata={**request.metadata, "issues": issues})
            return AgentResponse(
                status="failure",
                data={"score": base_score},
                errors=[error_msg],
                metadata=request.metadata
            )
        
        # Calculate new score
        num_issues = len(issues)
        total_penalty = num_issues * penalty_per_issue
        final_score = max(0.0, base_score - total_penalty)

        self._emit_json_log(
            "INFO", 
            f"Static analysis complete. Found {num_issues} issues. Base score {base_score} -> {final_score}",
            metadata={**request.metadata, "issues": issues, "penalized_score": final_score}
        )

        return AgentResponse(
            status="success" if num_issues == 0 else "issues_found",
            data={
                "score": final_score,
                "issues": issues,
                "filepath": filepath
            },
            metadata=request.metadata
        )
