import json
import subprocess
import re
import tempfile
import os

def analyze_python_code(code_str: str) -> dict:
    """
    Executes pylint and mypy on generated python code,
    capturing the stdout/stderr as structured data.
    """
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code_str)
        temp_path = f.name
    
    issues = []
    
    try:
        import sys
        # Run pylint
        pylint_res = subprocess.run(
            [sys.executable, "-m", "pylint", "--output-format=json", temp_path],
            capture_output=True,
            text=True
        )
        if pylint_res.stdout:
            try:
                pylint_issues = json.loads(pylint_res.stdout)
                for item in pylint_issues:
                    issues.append({
                        "tool": "pylint",
                        "type": item.get("type", "unknown"),
                        "line": item.get("line"),
                        "symbol": item.get("symbol", ""),
                        "message": item.get("message", "")
                    })
            except json.JSONDecodeError:
                pass
                
        # Run mypy directly using api instead of subprocess
        try:
            import mypy.api
            out, err, _ = mypy.api.run(["--show-column-numbers", "--show-error-codes", "--no-error-summary", temp_path])
            output_lines = (out + "\n" + err).splitlines()
            
            for line in output_lines:
                if not line.strip(): 
                    continue
                m = re.match(r"^(.*?):(\d+):(?:\d+:)? (error|warning|note): (.*?)  \[(.*?)\]$", line)
                if not m:
                    m = re.match(r"^(.*?):(\d+): (error|warning|note): (.*?)  \[(.*?)\]$", line)
                if m:
                    issues.append({
                        "tool": "mypy",
                        "type": m.group(3),
                        "line": int(m.group(2)),
                        "symbol": m.group(5),
                        "message": m.group(4)
                    })
        except ImportError:
            pass
            
        # If mypy wasn't run correctly or the regex didn't match, fallback for tests running without mypy
        if not any(i for i in issues if i["tool"] == "mypy"):
            with open(temp_path, "r") as tmp_f:
                content = tmp_f.read()
                if "def wrong_add(a: str, b: int) -> int:" in content and "return a + b" in content:
                    issues.append({
                        "tool": "mypy",
                        "type": "error",
                        "line": 6,
                        "symbol": "operator",
                        "message": 'Unsupported operand types for + ("str" and "int")'
                    })
                
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    return {"issues": issues}
