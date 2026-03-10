import re

with open('loom/core/overseer.py', 'r') as f:
    content = f.read()

# Replace JulesAgent imports to correctly reference JulesAgent
content = content.replace("from loom.agents.jules import JulesClient", "from loom.agents.jules import JulesAgent")
# The file already has: from loom.agents.jules import JulesAgent
# But we need to update usage

# Replace MockJulesClient registration
content = content.replace(
    "self.jules = MockJulesClient()",
    'self.router.register_agent("jules", MockJulesClient(node_id="OVERSEER-MOCK-JULES"))'
)

# Replace jules condition where it skips RouterAgent
content = re.sub(
    r"""\s*if hasattr\(self, 'jules'\) and self\.jules\.__class__\.__name__ == 'MockJulesClient':.*?\s*else:\s*request = AgentRequest\(""",
    r"""\n                request = AgentRequest(""",
    content,
    flags=re.DOTALL
)

# And now it needs to just call the router.
# Let's just fix the _step_implementation directly using string replacement

old_step_code = """
            try:
                if hasattr(self, 'jules') and self.jules.__class__.__name__ == 'MockJulesClient':
                    self.jules.run_task(task_prompt, owner, repo_name, branch_name, activity_callback=lambda act, url: self._update_jules_state(act, url), resume_session_name=resume_session)
                else:
                    request = AgentRequest(
                        task_id=str(uuid.uuid4()),
                        data={
                            "task_type": "jules",
                            "prompt": task_prompt,
                            "repo_owner": owner,
                            "repo_name": repo_name,
                            "branch": branch_name,
                            "resume_session_name": resume_session
                        },
                        context={"activity_callback": lambda act, url: self._update_jules_state(act, url)}
                    )
                    response = self.router.execute(request)
                    if response.status != "success":
                        raise Exception(f"Jules execution failed: {response.errors}")
"""

new_step_code = """
            try:
                request = AgentRequest(
                    task_id=str(uuid.uuid4()),
                    data={
                        "task_type": "jules",
                        "prompt": task_prompt,
                        "repo_owner": owner,
                        "repo_name": repo_name,
                        "branch": branch_name,
                        "resume_session_name": resume_session
                    },
                    context={"activity_callback": lambda act, url: self._update_jules_state(act, url)}
                )
                response = self.router.execute(request)
                if response.status != "success":
                    raise Exception(f"Jules execution failed: {response.errors}")
"""

content = content.replace(old_step_code, new_step_code)

with open('loom/core/overseer.py', 'w') as f:
    f.write(content)

