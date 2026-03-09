import json
import subprocess
from pathlib import Path
from typing import Dict, Any, List

class PythonAnalyzer:
    """
    Executes Ruff static analysis independently to ensure isolated testability.
    Parses outputs into structured JSON.
    """
    def __init__(self, config_path: str = "backend/tools/ruff.toml"):
        self.config_path = Path(config_path)
    
    def analyze_file(self, filepath: str) -> Dict[str, Any]:
        """
        Runs Ruff on the specified file and returns the analysis report as a structured JSON object.
        """
        path = Path(filepath)
        if not path.exists():
            return {
                "status": "error",
                "message": f"File not found: {filepath}",
                "issues": []
            }
        
        config_path_str = str(self.config_path.absolute()) if self.config_path else ""
        
        cmd = [
            "ruff", "check",
            str(path.absolute()),
            "--output-format", "json"
        ]
        
        if config_path_str:
            cmd.extend(["--config", config_path_str])
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=False  # We want to handle non-zero exit codes (issues found) gracefully
            )
            
            # Ruff might output nothing if there are no errors, or an empty JSON list '[]'
            issues: List[Dict[str, Any]] = []
            if result.stdout.strip():
                try:
                    issues = json.loads(result.stdout)
                except json.JSONDecodeError:
                    return {
                        "status": "error",
                        "message": "Failed to parse Ruff JSON output",
                        "raw_output": result.stdout,
                        "issues": []
                    }
            
            # If exit code is not 0 and stdout is empty, it could be a fatal error (e.g., config error)
            if result.returncode != 0 and not issues and result.stderr:
                return {
                     "status": "error",
                     "message": "Ruff execution failed",
                     "raw_error": result.stderr,
                     "issues": []
                }
            
            return {
                "status": "success" if not issues else "issues_found",
                "issues": issues
            }
            
        except FileNotFoundError:
            return {
                "status": "error",
                "message": "Ruff executable not found. Ensure it is installed.",
                "issues": []
            }
        except Exception as e:
             return {
                "status": "error",
                "message": str(e),
                "issues": []
            }
