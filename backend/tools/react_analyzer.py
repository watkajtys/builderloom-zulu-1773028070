import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

class ReactAnalyzer:
    """
    Executes ESLint static analysis independently to ensure isolated testability.
    Parses outputs into structured JSON.
    """
    def __init__(self, config_path: str = "eslint.config.js"):
        self.config_path = Path(config_path)

    def analyze_file(self, filepath: str, fix: bool = False) -> Dict[str, Any]:
        """
        Runs ESLint on the specified file and returns the analysis report as a structured JSON object.
        """
        path = Path(filepath)
        if not path.exists():
            return {
                "status": "error",
                "message": f"File not found: {filepath}",
                "issues": []
            }

        config_path_str = str(self.config_path.absolute()) if self.config_path else ""

        # Using npx eslint
        cmd = ["npx", "eslint", str(path.absolute()), "-f", "json"]

        if fix:
            cmd.append("--fix")

        if config_path_str:
            # We add ESLINT_USE_FLAT_CONFIG=true if needed or just use the config
            # since v9 it uses flat config automatically
            cmd.extend(["-c", config_path_str])

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=False
            )

            issues: List[Dict[str, Any]] = []
            
            # ESLint typically outputs the JSON array on stdout
            if result.stdout.strip():
                try:
                    stdout_str = result.stdout.strip()
                    # To avoid json.JSONDecodeError caused by extraneous logging, isolate the JSON string
                    match = re.search(r'\[\s*(?:\{|\])', stdout_str)
                    start_idx = match.start() if match else -1
                    end_idx = stdout_str.rfind(']')

                    if start_idx != -1 and end_idx != -1 and end_idx >= start_idx:
                        json_str = stdout_str[start_idx:end_idx+1]
                        parsed_output = json.loads(json_str)
                    else:
                        parsed_output = json.loads(stdout_str)
                        
                    # ESLint output format is an array of objects per file
                    if isinstance(parsed_output, list) and len(parsed_output) > 0:
                        file_result = parsed_output[0]
                        if "messages" in file_result:
                            issues = file_result["messages"]
                            
                except json.JSONDecodeError:
                    return {
                        "status": "error",
                        "message": "Failed to parse ESLint JSON output",
                        "raw_output": result.stdout,
                        "issues": []
                    }

            # If there's a configuration or parsing error, eslint might return non-zero exit code
            # and may or may not output standard JSON format with a fatal error.
            # In eslint format, a fatal parsing error is also in messages list usually with 'fatal': True
            has_fatal = any(issue.get("fatal") for issue in issues)
            
            # Evaluate success by verifying both that the parsed issues list is empty and the process returncode is 0.
            if result.returncode != 0 and not issues:
                return {
                     "status": "error",
                     "message": "ESLint execution failed",
                     "raw_error": result.stderr or result.stdout,
                     "issues": issues
                }

            if has_fatal:
                return {
                    "status": "error",
                    "message": "Fatal parsing or configuration error encountered",
                    "issues": issues
                }

            return {
                "status": "success" if not issues and result.returncode == 0 else "issues_found",
                "issues": issues
            }

        except FileNotFoundError:
            return {
                "status": "error",
                "message": "npx or eslint executable not found. Ensure it is installed.",
                "issues": []
            }
        except Exception as e:
             return {
                "status": "error",
                "message": str(e),
                "issues": []
            }
