import json
import subprocess
import os
import tempfile

def analyze_react_code(code_str: str) -> dict:
    """
    Executes ESLint on generated React code,
    capturing the stdout as structured JSON data.
    """
    # To avoid "File ignored because outside of base path" we create the temp file in the repo root
    fd, temp_path = tempfile.mkstemp(suffix=".tsx", dir=os.getcwd())
    with os.fdopen(fd, "w") as f:
        f.write(code_str)
    
    issues = []
    
    try:
        # Run eslint with json output format
        # We use npx to run the local eslint
        # Pass --no-ignore to ensure the temporary file is analyzed even if ignore rules would match it
        eslint_res = subprocess.run(
            ["npx", "eslint", "--format", "json", "--no-ignore", temp_path],
            capture_output=True,
            text=True
        )
        
        # ESLint exits with code 1 if there are errors, 2 if crash
        if eslint_res.stdout:
            try:
                eslint_issues = json.loads(eslint_res.stdout)
                
                # ESLint returns an array of file results
                for file_result in eslint_issues:
                    for message in file_result.get("messages", []):
                        # severity: 1 is warning, 2 is error
                        severity = "warning" if message.get("severity") == 1 else "error"
                        issues.append({
                            "tool": "eslint",
                            "type": severity,
                            "line": message.get("line"),
                            "symbol": message.get("ruleId", ""),
                            "message": message.get("message", "")
                        })
            except json.JSONDecodeError:
                pass
                
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    return {"issues": issues}
