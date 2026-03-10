with open('loom/core/overseer.py', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "request = AgentRequest(" in line and "task_id=str(" in lines[i+1]:
        start_idx = i
        end_idx = i
        for j in range(i, i+15):
            if "response = self.router.execute(request)" in lines[j]:
                end_idx = j + 2
                break
        break

with open('loom/core/overseer.py', 'w') as f:
    for i, line in enumerate(lines):
        if i >= start_idx and i <= end_idx:
            stripped = line.lstrip()
            if stripped.startswith("request =") or stripped.startswith("response =") or stripped.startswith("if response"):
                f.write("                " + stripped)
            elif stripped.startswith("raise Exception"):
                f.write("                    " + stripped)
            elif stripped.startswith("task_id=") or stripped.startswith("data={") or stripped.startswith("context={"):
                f.write("                    " + stripped)
            elif stripped.startswith(")"):
                f.write("                " + stripped)
            elif stripped.startswith('"task_type"') or stripped.startswith('"prompt"') or stripped.startswith('"repo_owner"') or stripped.startswith('"repo_name"') or stripped.startswith('"branch"') or stripped.startswith('"resume_session_name"'):
                f.write("                        " + stripped)
            elif stripped.startswith("}"):
                f.write("                    " + stripped)
            else:
                f.write(line)
        else:
            f.write(line)
