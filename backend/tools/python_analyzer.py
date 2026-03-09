import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List


class PythonAnalyzer:
    """
    Executes Ruff static analysis independently to ensure isolated testability.
    Parses outputs into structured JSON.
    """
    def __init__(self, config_path: str = "backend/tools/ruff.toml"):
        self.config_path = Path(config_path)

    def analyze_file(self, filepath: str, fix: bool = False) -> Dict[str, Any]:
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
            sys.executable, "-m", "ruff", "check",
            str(path.absolute()),
            "--output-format", "json"
        ]

        if fix:
            cmd.append("--fix")

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
                    stdout_str = result.stdout.strip()
                    # To avoid json.JSONDecodeError caused by extraneous logging or deprecation warnings
                    # prepended to standard output, we isolate the JSON string by extracting the substring
                    # from the first '[' (that indicates a JSON array start) to the last ']'
                    match = re.search(r'\[\s*(?:\{|\])', stdout_str)
                    start_idx = match.start() if match else -1
                    end_idx = stdout_str.rfind(']')

                    if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
                        json_str = stdout_str[start_idx:end_idx+1]
                        issues = json.loads(json_str)
                    else:
                        issues = json.loads(stdout_str)
                except json.JSONDecodeError:
                    return {
                        "status": "error",
                        "message": "Failed to parse Ruff JSON output",
                        "raw_output": result.stdout,
                        "issues": []
                    }

            # Evaluate success by verifying both that the parsed issues list is empty and the process returncode is 0.
            # Relying solely on an empty issues list can cause fatal tool crashes with non-zero exit codes to be falsely reported as successful.
            if result.returncode != 0 and not issues:
                return {
                     "status": "error",
                     "message": "Ruff execution failed",
                     "raw_error": result.stderr,
                     "issues": []
                }

            return {
                "status": "success" if not issues and result.returncode == 0 else "issues_found",
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
