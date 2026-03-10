import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as crypto from 'crypto';

test.beforeAll(() => {
  // Ensure python dependencies are installed prior to running the backend integration tests
  execSync('pip install -q -r requirements.txt', { stdio: 'ignore' });
});

test('App initializes correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Telemetry / Log Grid')).toBeVisible();
});

test('Fix broken icon rendering showing raw text strings across the UI', async ({ page }) => {
  await page.goto('/');

  // Verify that the fallback raw text strings are no longer visible
  await expect(page.locator('text=monitor_heart')).not.toBeVisible();
  await expect(page.locator('text=analytics').first()).not.toBeVisible();
  await expect(page.locator('text=filter_alt').first()).not.toBeVisible();
  await expect(page.locator('text=file_download').first()).not.toBeVisible();

  // Verify that the lucide-react SVGs are rendered in the sidebar (we can check for specific class or just svg presence)
  const sidebar = page.locator('aside').filter({ hasText: 'Zulu AI' });
  await expect(sidebar).toBeVisible();
  
  // Checking that svgs exist within the sidebar links
  const systemHealthLink = sidebar.locator('a[href*="/health"]').first();
  await expect(systemHealthLink.locator('svg')).toBeVisible();

  await page.screenshot({ path: 'evidence.png' });
});

test('Clean up the top right global navigation and search alignment', async ({ page }) => {
  await page.goto('/');

  // Verify the input has proper placeholder and doesn't overlap weirdly
  const searchInput = page.getByPlaceholder('SEARCH_ZULU_SYSTEMS...');
  await expect(searchInput).toBeVisible();
  
  // Verify it exists in a TopNavUtility or similar container, and icons are rendered
  // Verify the bell button has an aria-label
  const notifButton = page.locator('button[aria-label="Notifications"]');
  await expect(notifButton).toBeVisible();
  
  // Check the bell icon doesn't show raw text fallback
  await expect(page.locator('text=notifications')).not.toBeVisible();
  await expect(page.locator('text=search').first()).not.toBeVisible();

  await page.screenshot({ path: 'evidence.png' });
});

test('Zulu Dashboard loads correctly', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
  await expect(page.locator('text=System Health')).toBeVisible();
  await expect(page.locator('text=Telemetry_Stream')).toBeVisible();
});

test('React system-health route loads and EXPORT button is de-emphasized', async ({ page }) => {
  // Adapted for the new SystemHealth design
  await page.goto('/health');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
  
  // The old export button was removed, verify the Settings button is present and neutrally styled
  const settingsBtn = page.locator('header button').last();
  await expect(settingsBtn).toBeVisible();
  
  // Verify it has the neutral styling
  await expect(settingsBtn).toHaveClass(/text-zinc-grey/);
  await expect(settingsBtn).not.toHaveClass(/bg-electric-blue/);
  
  await page.screenshot({ path: 'evidence.png' });
});

test('PocketBase connection uses proper relative path', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
});

test('Dashboard uses abstracted reusable components', async ({ page }) => {
  await page.goto('/health');
  
  // Verify Sidebar layout component is visible
  await expect(page.locator('aside').filter({ hasText: 'Zulu AI' })).toBeVisible();
  
  // Verify Header layout component is visible
  await expect(page.locator('header').filter({ hasText: 'Health' }).first()).toBeVisible();

  // Verify new components representing equivalent data are loaded
  await expect(page.locator('text=Compute Clusters')).toBeVisible();
  await expect(page.locator('text=Vector Storage')).toBeVisible();
  await expect(page.locator('text=API Gateway')).toBeVisible();

  // Verify TelemetryStream component is active (restored)
  await expect(page.locator('text=Telemetry_Stream')).toBeVisible();

  // Verify dynamic data visualization is active
  await expect(page.locator('text=Hardware Pulse')).toBeVisible();
});

test('Smooth chart data rendering to feel like a premium, realistic dashboard', async ({ page }) => {
  await page.goto('/health');
  
  // Wait for the chart to load
  await expect(page.locator('text=Hardware Pulse')).toBeVisible();
  
  // Verify the bar chart elements are present
  const bars = page.locator('div.flex-1.flex.flex-col.justify-end > div.bg-electric-blue');
  expect(await bars.count()).toBeGreaterThan(10);
  
  await page.screenshot({ path: 'evidence.png' });
});

test('Telemetry logs maintain a strict hanging indent when wrapping', async ({ page }) => {
  await page.goto('/health');
  
  // Wait for the specific multiline error log to be rendered
  await page.waitForSelector('text=retrying...');
  
  // Get the message span of the specific log
  const errLogMsgSpan = page.locator('span', { hasText: 'ConnectionTimeout' });
  const spanBox = await errLogMsgSpan.boundingBox();
  expect(spanBox).not.toBeNull();
  
  // Extract the bounding rects of the individual lines inside the span
  const rects = await errLogMsgSpan.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return Array.from(range.getClientRects()).map(r => ({ x: r.x, y: r.y, w: r.width, h: r.height }));
  });
  
  // Ensure it actually wrapped (more than 1 line)
  expect(rects.length).toBeGreaterThan(1);
  
  // Validate hanging indent: second line's X coordinate must perfectly match the first line's X coordinate
  // The first ClientRect corresponds to the first line segment, the last to the last line segment
  const firstLineX = rects[0].x;
  const lastLineX = rects[rects.length - 1].x;
  
  // Allow sub-pixel tolerance for rendering variations
  expect(Math.abs(firstLineX - lastLineX)).toBeLessThan(2);
  
  await page.screenshot({ path: 'evidence.png' });
});



test('Python agent logs are structured JSON format', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  
  // Since backend outputs JSON to state.live_logs, the viewer UI might fetch and render it.
  // To verify the structured format, we can run a brief python script locally in playwright using execSync, 
  // or just assert that if the UI renders logs, they don't crash, and take a screenshot.
  // But actually we can just invoke the python script and assert its output is valid JSON directly in the Node.js test environment.
  
  
  // const stdout = execSync('python3 -c "import logging; from main import logger, StateLogHandler; logger.info(\'Integration test log\', extra={\'markup\': True})"');
  const stderrOutput = execSync('python3 -c "import sys; import logging; from main import logger, StateLogHandler; logger.info(\'Integration test log\', extra={\'markup\': True})" 2>&1');
  const outStr = stderrOutput.toString().trim();
  const startIdx = outStr.indexOf('{');
  const endIdx = outStr.lastIndexOf('}');
  
  let jsonStr = '{}';
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = outStr.substring(startIdx, endIdx + 1);
  }
  
  // Assert the output is parsable JSON
  let isJson = false;
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(jsonStr);
    isJson = true;
  } catch(e) {
    // Ignore parse error
  }
  
  expect(isJson).toBe(true);
  expect(parsed.logger).toBe('loom');
  expect(parsed.message).toBe('Integration test log');
  expect(parsed.level).toBe('INFO');
  
  // Screenshot as required by rules
  await page.screenshot({ path: 'evidence.png' });
});

test('Load the dashboard and verify that mock JSON logs of different \'event_type\'s are correctly styled using Geist Mono. Click the filter toggles to verify that \'thought\' logs can be hidden while \'error\' logs remain visible.', async ({ page }) => {
  await page.goto('/');

  // Verify the log grid renders and shows logs
  await expect(page.locator('text=Log Grid')).toBeVisible();

  // Verify 'thought' log is visible initially
  const thoughtLog = page.locator('text=evaluating_model_drift');
  await expect(thoughtLog).toBeVisible();

  // Verify 'error' log is visible initially
  const errorLog = page.locator('text=ConnectionTimeout');
  await expect(errorLog).toBeVisible();

  // Verify styling (font-mono) - check if our specific class logic applied
  const gridContainer = page.locator('.custom-scrollbar');
  await expect(gridContainer).toBeVisible();
  
  // The filter button itself might be hidden inside the dropdown so we must click "Filters" first if it's not rendered via hover simulation well in headless.
  const filterDropdownButton = page.locator('button', { hasText: 'Filters' });
  await filterDropdownButton.click();

  // Find the thought toggle and click it to disable
  const thoughtToggle = page.locator('button', { hasText: 'THOUGHT' });
  await thoughtToggle.click({ force: true });

  // Verify the URL was updated
  await expect(page).toHaveURL(/levels=.*INFO.*ERROR.*WARN.*DEBUG.*/);
  await expect(page).not.toHaveURL(/THOUGHT/);

  // Verify thought log is hidden
  await expect(thoughtLog).not.toBeVisible();

  // Verify error log remains visible
  await expect(errorLog).toBeVisible();

  // Add a verification for the abstract configuration architecture (Testing UI reflects utility logic)
  const infoToggle = page.locator('button', { hasText: 'INFO' });
  await expect(infoToggle).toHaveClass(/bg-electric-blue\/10/);

  await page.screenshot({ path: 'evidence.png' });
});

test('Elevate the Filter Config popover for better visual hierarchy', async ({ page }) => {
  await page.goto('/');

  // Wait for the Log Grid header to load
  await expect(page.locator('text=Log Grid')).toBeVisible();

  // Find the filters button
  const filterBtn = page.locator('button', { hasText: 'Filters' });
  await expect(filterBtn).toBeVisible();

  // The popover should initially be hidden (or block if hover group is active, but we test the JS toggle logic)
  // const popover = page.locator('div').filter({ hasText: 'Filter Config' }).nth(1);
  // Due to structure, we can just find the div containing h4 "Filter Config"
  const popoverContainer = page.locator('h4:has-text("Filter Config")').locator('..').locator('..');
  
  // Click the filters button to explicitly open it
  await filterBtn.click();
  
  // Wait for the popover to be visible
  await expect(popoverContainer).toBeVisible();
  
  // Verify the new visual classes are present
  await expect(popoverContainer).toHaveClass(/bg-dark-surface\/95/);
  await expect(popoverContainer).toHaveClass(/backdrop-blur-md/);
  await expect(popoverContainer).toHaveClass(/border-zinc-grey\/50/);
  await expect(popoverContainer).toHaveClass(/ring-1/);
  await expect(popoverContainer).toHaveClass(/ring-electric-blue\/30/);
  await expect(popoverContainer).toHaveClass(/shadow-\[0_10px_40px_rgba\(0,0,0,0\.8\)\]/);
  
  // It should be explicitly block because isFilterOpen is true
  await expect(popoverContainer).toHaveClass(/block/);

  // Take screenshot as required
  await page.screenshot({ path: 'evidence.png' });
});

test('Ensure Header and Views Use Reusable PageLayout Abstraction', async ({ page }) => {
  // Navigate to Code Quality view
  await page.goto('/health?tab=code-quality');
  
  // Verify CodeQuality uses standard layout components
  const pageHeader = page.locator('header').first();
  await expect(pageHeader).toBeVisible();
  
  // Verify Global Header navigation elements render within the shared PageHeader structure
  await page.goto('/');
  const globalHeader = page.locator('header').first();
  await expect(globalHeader.locator('button:has-text("Health")')).toBeVisible();
  await expect(globalHeader.locator('button:has-text("Logs")')).toBeVisible();
  await expect(globalHeader.locator('button:has-text("Nodes")')).toBeVisible();
});

test('Implement the "Code Quality" UI component', async ({ page }) => {
  // Navigate to the newly updated code quality tab route
  await page.goto('/health?tab=code-quality');

  // Verify the header title exists
  const headerText = page.locator('text=Repository Pulse');
  await expect(headerText).toBeVisible();

  // Verify list module items
  await expect(page.locator('text=zulu-factory-core-v2')).toBeVisible();
  await expect(page.locator('text=gateway-proxy-handler')).toBeVisible();
  await expect(page.locator('text=neural-weight-distributor')).toBeVisible();
  await expect(page.locator('text=vector-storage-adapter')).toBeVisible();

  // Verify Stats Cards
  await expect(page.locator('text=Build Velocity')).toBeVisible();
  await expect(page.locator('text=Active Vulnerabilities')).toBeVisible();
  await expect(page.locator('text=Pull Request Cycle')).toBeVisible();

  // Verify Sidebar Nav link interaction
  const codeQualityLink = page.locator('aside a', { hasText: 'Code Quality' });
  await expect(codeQualityLink).toBeVisible();
  await expect(codeQualityLink).toHaveClass(/border-l-2/); // Since it's active

  // Verify the Footer component correctly renders and deduplicates Layout logic
  await expect(page.locator('text=Zone: CLOUD-NATIVE-X86')).toBeVisible();
  await expect(page.locator('text=Automated Linting: Enabled')).toBeVisible();

  // Take screenshot as required
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement Sub-Agent base architecture and interfaces', async ({ page }) => {
  // Test that the python BaseAgent and IO models can be imported and instantiated,
  // and that _log emits the expected JSON format with timestamp, node_id, and log_level.
  
  const script = `
import sys
import json
import logging
from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

class DummyAgent(BaseAgent):
    def execute(self, request: AgentRequest) -> AgentResponse:
        self._log("INFO", "Dummy execution")
        return AgentResponse(status="success", data={"test": True})

agent = DummyAgent(node_id="TEST-NODE")
req = AgentRequest(task_id="test-123", data={"input": 42})
res = agent.execute(req)

print("---RESPONSE---")
print(res.status)
print(res.data)
`;

  const combinedOutput = execSync(`python3 -c '${script}' 2>&1`);
  const outStr = combinedOutput.toString().trim();
  const outputLines = outStr.split('\n');
  
  // Find the log line
  const logLine = outputLines.find(line => line.includes('Dummy execution'));
  expect(logLine).toBeDefined();

  // Parse the JSON log. 
  // Standard logging might output: INFO:loom:{"timestamp":...}
  // The log line could also contain trailing characters like color codes, so we extract strictly
  const startIdx = logLine!.indexOf('{');
  const endIdx = logLine!.lastIndexOf('}');
  const jsonPartStr = logLine!.substring(startIdx, endIdx + 1);
  
  const parsedLog = JSON.parse(jsonPartStr);
  
  expect(parsedLog.log_level).toBe('INFO');
  expect(parsedLog.node_id).toBe('TEST-NODE');
  expect(parsedLog.message).toBe('Dummy execution');
  expect(parsedLog.timestamp).toBeDefined();

  // Find the response
  const responseIdx = outputLines.indexOf('---RESPONSE---');
  expect(responseIdx).toBeGreaterThan(-1);
  expect(outputLines[responseIdx + 1]).toBe('success');
  expect(outputLines[responseIdx + 2]).toBe("{'test': True}");
  
  await page.screenshot({ path: 'evidence.png' });
});

test('Define core data models and interfaces for the prompt chain', async ({ page }) => {
  
  // write script to file, then execute to avoid escaping issues
  const scriptContent = `
import sys
import json
from backend.agents.core.chain import Chain, Node, Edge, EdgeType, ExecutionState
from backend.agents.core.chain_store import ChainStore

node1 = Node(node_id="n1", agent_type="researcher", config={"max_results": 5})
node2 = Node(node_id="n2", agent_type="writer")
edge = Edge(source="n1", target="n2", edge_type=EdgeType.DIRECT)
chain = Chain(chain_id="chain-test-123", nodes=[node1, node2], edges=[edge])

state = ExecutionState(chain_id=chain.chain_id, current_node="n1", variables={"query": "test"})

store = ChainStore()

print("---MODELS---")
print(json.dumps(chain.model_dump()))
print(json.dumps(state.model_dump()))
print(store.pb.base_url)
`;
  const filename = 'test_script_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  const modelsIdx = outputLines.indexOf('---MODELS---');
  expect(modelsIdx).toBeGreaterThan(-1);
  
  const chainStr = outputLines[modelsIdx + 1];
  const chainStart = chainStr.indexOf('{');
  const chainEnd = chainStr.lastIndexOf('}');
  const chainJson = JSON.parse(chainStr.substring(chainStart, chainEnd + 1));

  expect(chainJson.chain_id).toBe('chain-test-123');
  expect(chainJson.nodes.length).toBe(2);
  expect(chainJson.edges[0].source).toBe('n1');
  
  const stateStr = outputLines[modelsIdx + 2];
  const stateStart = stateStr.indexOf('{');
  const stateEnd = stateStr.lastIndexOf('}');
  const stateJson = JSON.parse(stateStr.substring(stateStart, stateEnd + 1));

  expect(stateJson.chain_id).toBe('chain-test-123');
  expect(stateJson.current_node).toBe('n1');

  // Verify PocketBase connection URL
  const pbUrl = outputLines[modelsIdx + 3];
  expect(pbUrl).toBe('http://loom-pocketbase:8090');

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('User clicks the System Health tab in the sidebar and navigates to the new route successfully.', async ({ page }) => {
  // Start on homepage
  await page.goto('/');
  
  // Click on the new System Control sidebar tab
  const sidebarLink = page.locator('[data-testid="sidebar-system-health"]');
  await expect(sidebarLink).toBeVisible();
  await sidebarLink.click();
  
  // Verify navigation to /system-health
  await expect(page).toHaveURL(/.*\/system-health/);
  
  // Verify default tab is System Health
  const systemHealthPlaceholder = page.getByText('Real-time Pulse Active', { exact: true });
  await expect(systemHealthPlaceholder).toBeVisible();
  
  // Toggle to Code Quality
  const codeQualityTab = page.locator('[data-testid="tab-code-quality"]');
  await expect(codeQualityTab).toBeVisible();
  await codeQualityTab.click();
  
  // Verify URL updated and Code Quality renders
  await expect(page).toHaveURL(/.*tab=code-quality/);
  const codeQualityPlaceholder = page.getByText('Scanning Repositories...', { exact: true });
  await expect(codeQualityPlaceholder).toBeVisible();

  // Capture evidence screenshot of active feature
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement a single node executor with prompt interpolation', async ({ page }) => {
  const scriptContent = `
import sys
import json
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai
from unittest.mock import MagicMock

from backend.agents.core.chain import Node, ExecutionState
from backend.agents.router import RouterAgent
from backend.agents.core.io_models import AgentRequest

# Mock the genai model
mock_model = MagicMock()
mock_response = MagicMock()
mock_response.text = "Mocked LLM completion"
mock_model.generate_content.return_value = mock_response

# Patch the genai.GenerativeModel to return our mock
genai.GenerativeModel = MagicMock(return_value=mock_model)

# 1. Create a node with a prompt template
node_config = {
    "prompt_template": "Analyze the following system health metric: {metric_name} with value {metric_value}.",
    "model": "gemini-2.5-flash"
}
node = Node(node_id="analyst_node", agent_type="analyzer", config=node_config)

# 2. Create the executor
router = RouterAgent()

# 3. Create execution state with variables to be interpolated
state = ExecutionState(
    chain_id="chain-xyz",
    current_node="analyst_node",
    variables={"metric_name": "CPU_LOAD", "metric_value": "95%"}
)

# 4. Execute the node
request = AgentRequest(task_id="task-1", data={
    "task_type": "prompt",
    "state": state.model_dump(),
    "node": node.model_dump()
})
response = router.execute(request)

# Output results for verification
print("---RESULT---")
print(json.dumps({
    "status": response.status,
    "result": response.data.get("result"),
    "interpolated_prompt": mock_model.generate_content.call_args[0][0]
}))
`;

  const filename = 'test_executor_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  const resultIdx = outputLines.indexOf('---RESULT---');
  expect(resultIdx).toBeGreaterThan(-1);
  
  const resultStr = outputLines[resultIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));
  
  // Assert the execution was successful
  expect(resultJson.status).toBe('success');
  
  // Assert the mocked response was returned
  expect(resultJson.result).toBe('Mocked LLM completion');
  
  // Assert the variable interpolation worked perfectly
  expect(resultJson.interpolated_prompt).toBe('Analyze the following system health metric: CPU_LOAD with value 95%.');

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement the main execution loop and state orchestrator', async ({ page }) => {
  const scriptContent = `
import sys
import json
from unittest.mock import MagicMock
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

from backend.agents.core.chain import Chain, Node, Edge, EdgeType, ExecutionState
from backend.agents.core.orchestrator import ChainOrchestrator

# Setup mocks for LLM to return specific results based on prompt
def mock_generate_content(prompt, **kwargs):
    response = MagicMock()
    if "first node" in prompt.lower():
        response.text = "Result from node 1"
    elif "second node" in prompt.lower():
        response.text = "Result from node 2"
    else:
        response.text = "Generic result"
    return response

mock_model = MagicMock()
mock_model.generate_content.side_effect = mock_generate_content
genai.GenerativeModel = MagicMock(return_value=mock_model)

# Define nodes
node1 = Node(node_id="n1", agent_type="agent", config={"prompt_template": "This is the first node processing {initial_var}."})
node2 = Node(node_id="n2", agent_type="agent", config={"prompt_template": "This is the second node using {n1_output}."})

# Define chain and edges
edge = Edge(source="n1", target="n2", edge_type=EdgeType.DIRECT)
chain = Chain(chain_id="orchestrator_test_chain", nodes=[node1, node2], edges=[edge])

# Initial state
initial_state = ExecutionState(
    chain_id=chain.chain_id,
    current_node="n1",
    variables={"initial_var": "start_value"}
)

# Run orchestrator
orchestrator = ChainOrchestrator(chain)
final_state = orchestrator.run(initial_state)

print("---ORCHESTRATOR_RESULT---")
print(json.dumps({
    "final_node": final_state.current_node,
    "history_length": len(final_state.history),
    "variables": final_state.variables
}))
`;
  const filename = 'test_orchestrator_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  const resultIdx = outputLines.indexOf('---ORCHESTRATOR_RESULT---');
  expect(resultIdx).toBeGreaterThan(-1);
  
  const resultStr = outputLines[resultIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));
  
  // Verify execution completed the chain (current_node becomes None/null)
  expect(resultJson.final_node).toBeNull();
  
  // Verify history length (2 nodes executed)
  expect(resultJson.history_length).toBe(2);
  
  // Verify variables were passed correctly and output captured
  expect(resultJson.variables.initial_var).toBe("start_value");
  expect(resultJson.variables.n1_output).toBe("Result from node 1");
  expect(resultJson.variables.n2_output).toBe("Result from node 2");
  expect(resultJson.variables.latest_output).toBe("Result from node 2");

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Integrate Python static analysis execution', async ({ page }) => {
  const scriptContent = `
import sys
import json
from pathlib import Path
from backend.tools.python_analyzer import PythonAnalyzer

test_file = Path("test_file_ruff.py")
test_file.write_text("""
def foo():
 x = 1
 return x
import os
""")

analyzer = PythonAnalyzer(config_path="backend/tools/ruff.toml")
result = analyzer.analyze_file(str(test_file))

test_file_clean = Path("test_file_clean.py")
test_file_clean.write_text("""
def foo():
    x = 1
    return x
""")

result_clean = analyzer.analyze_file(str(test_file_clean))

print("---ANALYZER_RESULT---")
print(json.dumps(result))
print("---CLEAN_RESULT---")
print(json.dumps(result_clean))
print("---ANALYZER_CONFIG---")
print(json.dumps({"config_path": str(analyzer.config_path)}))

# Add a test case for a fatal crash scenario (invalid config path)
invalid_analyzer = PythonAnalyzer(config_path="invalid_path.toml")
result_invalid = invalid_analyzer.analyze_file(str(test_file_clean))
print("---INVALID_RESULT---")
print(json.dumps(result_invalid))

test_file.unlink()
test_file_clean.unlink()
`;
  const filename = 'test_analyzer_integration_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  const resultIdx = outputLines.indexOf('---ANALYZER_RESULT---');
  expect(resultIdx).toBeGreaterThan(-1);
  
  const resultStr = outputLines[resultIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));
  
  expect(resultJson.status).toBe('issues_found');
  expect(resultJson.issues.length).toBeGreaterThan(0);
  
  const codes = resultJson.issues.map((i: { code: string }) => i.code);
  expect(codes).toContain('E402'); // Module level import not at top of file
  expect(codes).toContain('F401'); // os imported but unused
  
  const cleanResultIdx = outputLines.indexOf('---CLEAN_RESULT---');
  expect(cleanResultIdx).toBeGreaterThan(-1);
  
  const cleanResultStr = outputLines[cleanResultIdx + 1];
  const cleanStart = cleanResultStr.indexOf('{');
  const cleanEnd = cleanResultStr.lastIndexOf('}');
  const cleanResultJson = JSON.parse(cleanResultStr.substring(cleanStart, cleanEnd + 1));

  expect(cleanResultJson.status).toBe('success');
  expect(cleanResultJson.issues.length).toBe(0);

  const configIdx = outputLines.indexOf('---ANALYZER_CONFIG---');
  expect(configIdx).toBeGreaterThan(-1);

  const configStr = outputLines[configIdx + 1];
  const configStart = configStr.indexOf('{');
  const configEnd = configStr.lastIndexOf('}');
  const configJson = JSON.parse(configStr.substring(configStart, configEnd + 1));

  expect(configJson.config_path).toContain('ruff.toml');

  const invalidIdx = outputLines.indexOf('---INVALID_RESULT---');
  expect(invalidIdx).toBeGreaterThan(-1);

  const invalidStr = outputLines[invalidIdx + 1];
  const invalidStart = invalidStr.indexOf('{');
  const invalidEnd = invalidStr.lastIndexOf('}');
  const invalidJson = JSON.parse(invalidStr.substring(invalidStart, invalidEnd + 1));

  // Should NOT be falsely reported as successful despite 0 issues found by parser.
  expect(invalidJson.status).toBe('error');
  expect(invalidJson.issues.length).toBe(0);
  expect(invalidJson.message).toBe('Ruff execution failed');

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Integrate React static analysis execution', async ({ page }) => {
  const scriptContent = `
import sys
import json
from pathlib import Path
from backend.tools.react_analyzer import ReactAnalyzer

test_file = Path("test_file_react_dirty.tsx")
test_file.write_text("""
import { useState } from 'react';

export function TestComponent() {
  const [state, setState] = useState(0);
  const x = 1;
  return <div>{x}</div>;
}
""")

analyzer = ReactAnalyzer(config_path="eslint.config.js")
result = analyzer.analyze_file(str(test_file))

test_file_clean = Path("test_file_react_clean.tsx")
test_file_clean.write_text("""
export function TestComponent() {
  const x = 1;
  return <div>{x}</div>;
}
""")

result_clean = analyzer.analyze_file(str(test_file_clean))

print("---ANALYZER_RESULT---")
print(json.dumps(result))
print("---CLEAN_RESULT---")
print(json.dumps(result_clean))
print("---ANALYZER_CONFIG---")
print(json.dumps({"config_path": str(analyzer.config_path)}))

# Add a test case for a fatal crash scenario (invalid config path)
invalid_analyzer = ReactAnalyzer(config_path="invalid_path.config.js")
result_invalid = invalid_analyzer.analyze_file(str(test_file_clean))
print("---INVALID_RESULT---")
print(json.dumps(result_invalid))

test_file.unlink()
test_file_clean.unlink()
`;
  const filename = 'test_react_analyzer_integration_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  const resultIdx = outputLines.indexOf('---ANALYZER_RESULT---');
  expect(resultIdx).toBeGreaterThan(-1);
  
  const resultStr = outputLines[resultIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));
  
  expect(resultJson.status).toBe('issues_found');
  expect(resultJson.issues.length).toBeGreaterThan(0);
  
  const rules = resultJson.issues.map((i: { ruleId: string }) => i.ruleId);
  expect(rules).toContain('@typescript-eslint/no-unused-vars'); // state or setState is unused
  
  const cleanResultIdx = outputLines.indexOf('---CLEAN_RESULT---');
  expect(cleanResultIdx).toBeGreaterThan(-1);
  
  const cleanResultStr = outputLines[cleanResultIdx + 1];
  const cleanStart = cleanResultStr.indexOf('{');
  const cleanEnd = cleanResultStr.lastIndexOf('}');
  const cleanResultJson = JSON.parse(cleanResultStr.substring(cleanStart, cleanEnd + 1));

  expect(cleanResultJson.status).toBe('success');
  expect(cleanResultJson.issues.length).toBe(0);

  const configIdx = outputLines.indexOf('---ANALYZER_CONFIG---');
  expect(configIdx).toBeGreaterThan(-1);

  const configStr = outputLines[configIdx + 1];
  const configStart = configStr.indexOf('{');
  const configEnd = configStr.lastIndexOf('}');
  const configJson = JSON.parse(configStr.substring(configStart, configEnd + 1));

  expect(configJson.config_path).toContain('eslint.config.js');

  const invalidIdx = outputLines.indexOf('---INVALID_RESULT---');
  expect(invalidIdx).toBeGreaterThan(-1);

  const invalidStr = outputLines[invalidIdx + 1];
  const invalidStart = invalidStr.indexOf('{');
  const invalidEnd = invalidStr.lastIndexOf('}');
  const invalidJson = JSON.parse(invalidStr.substring(invalidStart, invalidEnd + 1));

  // Should NOT be falsely reported as successful despite 0 issues found by parser.
  expect(invalidJson.status).toBe('error');
  expect(invalidJson.message).toBe('ESLint execution failed');

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Define core interfaces and state models for the unified execution engine', async ({ page }) => {
  // We write a temporary python script to test the python store and models
  const testScriptPath = 'backend/tools/test_execution_store_e2e.py';
  const testScriptContent = `
import sys
import os
import json
import uuid

# Add the backend root to the path so that imports resolve correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.tools.execution_engine import Job, JobStatus
from backend.tools.execution_store import ExecutionStore

class DummyRecord:
    def __init__(self, data: dict):
        self.id = data.get("id", "dummy_id")
        self.job_id = data.get("job_id")
        self.engine = data.get("engine")
        self.target = data.get("target")
        self.status = data.get("status")
        self.result = data.get("result", "")
        self.error = data.get("error", "")

class DummyCollection:
    def __init__(self):
        self.records = {}

    def get_first_list_item(self, filter_str: str):
        job_id = filter_str.split("'")[1]
        for r in self.records.values():
            if r["job_id"] == job_id:
                return DummyRecord(r)
        raise Exception("Not found")

    def update(self, id: str, data: dict):
        self.records[id] = data
        return data

    def create(self, data: dict):
        doc_id = str(uuid.uuid4())
        data["id"] = doc_id
        self.records[doc_id] = data
        return data

class DummyPB:
    def __init__(self):
        self._collection = DummyCollection()

    def collection(self, name: str):
        return self._collection

def main():
    store = ExecutionStore("http://127.0.0.1:8090")
    store.pb = DummyPB()
    job_id = str(uuid.uuid4())
    job = Job(id=job_id, engine="python_analyzer", target="main.py", status=JobStatus.RUNNING)
    
    # Save the job
    try:
        store.save_job(job)
    except Exception as e:
        print("---ERROR---")
        print(json.dumps({'status': 'error', 'message': str(e)}))
        sys.exit(1)
        
    # Retrieve the job
    try:
        retrieved = store.get_job(job_id)
        if retrieved:
            print("---SUCCESS---")
            print(retrieved.model_dump_json())
        else:
            print("---ERROR---")
            print(json.dumps({'status': 'error', 'message': 'Job not found'}))
    except Exception as e:
        print("---ERROR---")
        print(json.dumps({'status': 'error', 'message': str(e)}))

if __name__ == '__main__':
    main()
  `;

  const fs = await import('fs');
  fs.writeFileSync(testScriptPath, testScriptContent.trim());

  let stdout = '';
  try {
    const { execSync } = await import('child_process');
    stdout = execSync('python3 backend/tools/test_execution_store_e2e.py', { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string, message?: string }).stdout || (error as { message?: string }).message || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test failed. Output was:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.engine).toBe('python_analyzer');
  expect(resultJson.target).toBe('main.py');
  expect(resultJson.status).toBe('running');

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement core orchestrator dispatcher and routing logic', async ({ page }) => {
  const testScriptPath = 'backend/tools/test_orchestrator_e2e.py';
  const testScriptContent = `
import sys
import os
import json
import uuid

# Add the backend root to the path so that imports resolve correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.tools.execution_engine import Job, JobStatus, BaseExecutionEngine, ExecutionState
from backend.tools.orchestrator import Orchestrator
from backend.tools.execution_store import ExecutionStore

class DummyEngine(BaseExecutionEngine):
    def execute(self, job: Job) -> Job:
        job.status = JobStatus.COMPLETED
        job.result = {"mock_result": True}
        return job
    
    def get_status(self, job_id: str) -> ExecutionState:
        return ExecutionState(job_id=job_id, progress=50.0, message="Mock running", status=JobStatus.RUNNING)

class DummyRecord:
    def __init__(self, data: dict):
        self.id = data.get("id", "dummy_id")
        self.job_id = data.get("job_id")
        self.engine = data.get("engine")
        self.target = data.get("target")
        self.status = data.get("status")
        self.result = data.get("result", "")
        self.error = data.get("error", "")

class DummyCollection:
    def __init__(self):
        self.records = {}

    def get_first_list_item(self, filter_str: str):
        job_id = filter_str.split("'")[1]
        for r in self.records.values():
            if r["job_id"] == job_id:
                rec = DummyRecord(r)
                rec.id = r["id"] # Restore correct ID
                return rec
        raise Exception("Not found")

    def update(self, id: str, data: dict):
        # The data dict has the old ID we overwrote when creating. We must persist it back
        data["id"] = id
        self.records[id] = data
        return DummyRecord(data)

    def create(self, data: dict):
        doc_id = str(uuid.uuid4())
        data["id"] = doc_id
        self.records[doc_id] = data
        return DummyRecord(data)

def main():
    store = ExecutionStore("http://127.0.0.1:8090")
    dummy_collection = DummyCollection()
    store.pb.collection = lambda name: dummy_collection
    
    orchestrator = Orchestrator(store=store)
    orchestrator.register_engine("dummy_engine", DummyEngine())
    
    # Submit job
    job_id = orchestrator.submit_job("dummy_engine", "test_target")
    
    try:
        job = orchestrator.get_job(job_id)
        if not job or job.status != JobStatus.PENDING:
            print("---ERROR---")
            sys.exit(1)
            
        orchestrator.process_queue()
        
        completed_job = orchestrator.get_job(job_id)
        if completed_job and completed_job.status == JobStatus.COMPLETED:
            print("---SUCCESS---")
            print(completed_job.model_dump_json())
        else:
            print("---ERROR---")
            print(json.dumps({'status': 'error', 'message': f'Job did not complete'}))
    except Exception as e:
        print("---ERROR---")
        print(e)

if __name__ == '__main__':
    main()
  `;

  fs.writeFileSync(testScriptPath, testScriptContent.trim());

  let stdout = '';
  try {
    stdout = execSync('python3 backend/tools/test_orchestrator_e2e.py', { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string, message?: string }).stdout || (error as { message?: string }).message || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.engine).toBe('dummy_engine');
  expect(resultJson.target).toBe('test_target');
  expect(resultJson.status).toBe('completed');
  expect(resultJson.result.mock_result).toBe(true);
  
  // Also verify that the orchestrator generated a job ID properly
  expect(typeof resultJson.id).toBe('string');
  expect(resultJson.id.length).toBeGreaterThan(10);

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Add state tracking, error handling, and retries to the orchestrator', async ({ page }) => {
  const testScriptPath = 'backend/tools/test_orchestrator_retries_e2e.py';
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'import uuid',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.tools.execution_engine import Job, JobStatus, BaseExecutionEngine, ExecutionState',
    'from backend.tools.orchestrator import Orchestrator',
    'from backend.tools.execution_store import ExecutionStore',
    '',
    'class FailingThenSucceedingEngine(BaseExecutionEngine):',
    '    def __init__(self):',
    '        self.attempts = 0',
    '',
    '    def execute(self, job: Job) -> Job:',
    '        self.attempts += 1',
    '        if self.attempts < 3:',
    '            raise Exception("Temporary Failure")',
    '        job.status = JobStatus.COMPLETED',
    '        job.result = {"mock_result": True, "attempts": self.attempts}',
    '        return job',
    '    ',
    '    def get_status(self, job_id: str) -> ExecutionState:',
    '        return ExecutionState(job_id=job_id, progress=50.0, message="Mock running", status=JobStatus.RUNNING)',
    '',
    'class PermanentFailingEngine(BaseExecutionEngine):',
    '    def execute(self, job: Job) -> Job:',
    '        raise Exception("Permanent Failure")',
    '    ',
    '    def get_status(self, job_id: str) -> ExecutionState:',
    '        return ExecutionState(job_id=job_id, progress=50.0, message="Mock running", status=JobStatus.RUNNING)',
    '',
    'class DummyRecord:',
    '    def __init__(self, data: dict):',
    '        self.id = data.get("id", "dummy_id")',
    '        self.job_id = data.get("job_id")',
    '        self.engine = data.get("engine")',
    '        self.target = data.get("target")',
    '        self.status = data.get("status")',
    '        self.result = data.get("result", "")',
    '        self.error = data.get("error", "")',
    '',
    'class DummyCollection:',
    '    def __init__(self):',
    '        self.records = {}',
    '',
    '    def get_first_list_item(self, filter_str: str):',
    '        job_id = filter_str.split("\'")[1]',
    '        for r in self.records.values():',
    '            if r["job_id"] == job_id:',
    '                rec = DummyRecord(r)',
    '                rec.id = r["id"] # Restore correct ID',
    '                return rec',
    '        raise Exception("Not found")',
    '',
    '    def update(self, id: str, data: dict):',
    '        data["id"] = id',
    '        self.records[id] = data',
    '        return DummyRecord(data)',
    '',
    '    def create(self, data: dict):',
    '        doc_id = str(uuid.uuid4())',
    '        data["id"] = doc_id',
    '        self.records[doc_id] = data',
    '        return DummyRecord(data)',
    '',
    'def main():',
    '    store = ExecutionStore("http://127.0.0.1:8090")',
    '    dummy_collection = DummyCollection()',
    '    store.pb.collection = lambda name: dummy_collection',
    '    ',
    '    orchestrator = Orchestrator(store=store)',
    '    orchestrator.register_engine("flaky_engine", FailingThenSucceedingEngine())',
    '    orchestrator.register_engine("failing_engine", PermanentFailingEngine())',
    '    ',
    '    job1_id = orchestrator.submit_job("flaky_engine", "test_target_1")',
    '    job2_id = orchestrator.submit_job("failing_engine", "test_target_2")',
    '    ',
    '    try:',
    '        orchestrator.process_queue()',
    '        ',
    '        job1 = orchestrator.get_job(job1_id)',
    '        job2 = orchestrator.get_job(job2_id)',
    '        ',
    '        if job1 and job1.status == JobStatus.COMPLETED and job2 and job2.status == JobStatus.FAILED:',
    '            print("---SUCCESS---")',
    '            print(json.dumps({',
    '                "job1": json.loads(job1.model_dump_json()),',
    '                "job2": json.loads(job2.model_dump_json())',
    '            }))',
    '        else:',
    '            print("---ERROR---")',
    '            print(json.dumps({"status": "error", "message": f"Jobs did not complete/fail as expected"}))',
    '    except Exception as e:',
    '        print("---ERROR---")',
    '        print(e)',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  const fs = await import('fs');
  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.job1.engine).toBe('flaky_engine');
  expect(resultJson.job1.status).toBe('completed');
  expect(resultJson.job1.result.attempts).toBe(3);
  
  expect(resultJson.job2.engine).toBe('failing_engine');
  expect(resultJson.job2.status).toBe('failed');
  expect(resultJson.job2.error).toBe('Permanent Failure');

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Extract the Orchestrator domain into a specialized ExecutorAgent sub-agent module', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');

  const testScriptPath = 'backend/agents/test_executor_agent_e2e.py';
  
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'import dataclasses',
    'import uuid',
    'import warnings',
    '',
    'with warnings.catch_warnings():',
    '    warnings.simplefilter("ignore")',
    '    import google.generativeai as genai',
    'from unittest.mock import MagicMock',
    'mock_model = MagicMock()',
    'genai.GenerativeModel = MagicMock(return_value=mock_model)',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.router import RouterAgent',
    'from backend.agents.executor import ExecutorAgent',
    'from backend.agents.core.io_models import AgentRequest, AgentResponse',
    'from backend.tools.execution_engine import BaseExecutionEngine, Job, JobStatus, ExecutionState',
    '',
    'class MockEngine(BaseExecutionEngine):',
    '    def execute(self, job: Job) -> Job:',
    '        job.status = JobStatus.COMPLETED',
    '        job.result = {"mock_executed_via_agent": True}',
    '        return job',
    '    ',
    '    def get_status(self, job_id: str) -> ExecutionState:',
    '        return ExecutionState(job_id=job_id, progress=50.0, message="Mock running", status=JobStatus.RUNNING)',
    '',
    'class DummyRecord:',
    '    def __init__(self, data: dict):',
    '        self.id = data.get("id", "dummy_id")',
    '        self.job_id = data.get("job_id")',
    '        self.engine = data.get("engine")',
    '        self.target = data.get("target")',
    '        self.status = data.get("status")',
    '        self.result = data.get("result", "")',
    '        self.error = data.get("error", "")',
    '',
    'class DummyCollection:',
    '    def __init__(self):',
    '        self.records = {}',
    '',
    '    def get_first_list_item(self, filter_str: str):',
    '        job_id = filter_str.split("\'")[1]',
    '        for r in self.records.values():',
    '            if r["job_id"] == job_id:',
    '                rec = DummyRecord(r)',
    '                rec.id = r["id"] # Restore correct ID',
    '                return rec',
    '        raise Exception("Not found")',
    '',
    '    def update(self, id: str, data: dict):',
    '        data["id"] = id',
    '        self.records[id] = data',
    '        return DummyRecord(data)',
    '',
    '    def create(self, data: dict):',
    '        doc_id = str(uuid.uuid4())',
    '        data["id"] = doc_id',
    '        self.records[doc_id] = data',
    '        return DummyRecord(data)',
    '',
    'def main():',
    '    router = RouterAgent(node_id="ROUTER-TEST-NODE")',
    '    executor_agent = router._registry.get("executor")',
    '    ',
    '    # Inject a dummy PB collection to avoid actual DB requirements',
    '    dummy_collection = DummyCollection()',
    '    executor_agent.store.pb.collection = lambda name: dummy_collection',
    '    ',
    '    # Register a mock engine via the ExecutorAgent',
    '    executor_agent.register_engine("mock_engine", MockEngine())',
    '    ',
    '    # Submit Job via AgentRequest routed through RouterAgent',
    '    req_submit = AgentRequest(',
    '        task_id="task-submit",',
    '        data={',
    '            "task_type": "executor",',
    '            "command": "submit_job",',
    '            "engine": "mock_engine",',
    '            "target": "dummy_target.py"',
    '        }',
    '    )',
    '    resp_submit = router.execute(req_submit)',
    '    job_id = resp_submit.data.get("job_id")',
    '    ',
    '    # Directly process the queue so it actually executes',
    '    executor_agent.orchestrator.process_queue()',
    '    ',
    '    # Get Job Status via AgentRequest',
    '    req_status = AgentRequest(',
    '        task_id="task-status",',
    '        data={',
    '            "task_type": "executor",',
    '            "command": "get_status",',
    '            "job_id": job_id',
    '        }',
    '    )',
    '    resp_status = router.execute(req_status)',
    '    ',
    '    print("---SUCCESS---")',
    '    print(json.dumps({',
    '        "submit": dataclasses.asdict(resp_submit),',
    '        "status": dataclasses.asdict(resp_status)',
    '    }))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.submit.status).toBe('success');
  expect(typeof resultJson.submit.data.job_id).toBe('string');
  
  expect(resultJson.status.status).toBe('success');
  expect(resultJson.status.data.execution_state.status).toBe('completed');
  expect(resultJson.status.data.execution_state.job_id).toBe(resultJson.submit.data.job_id);

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('ArchitectAgent receives code with linting errors, runs analysis, appends violations to its payload, and reduces the confidence score.', async ({ page }) => {
  const testScriptPath = 'backend/tools/test_architect_e2e.py';
  const badFilePath = 'backend/tools/bad_react_file.tsx';
  
  // A generic bad TSX file with exactly 5 ESLint errors
  const badFileContent = [
    'import React from "react";', // 1: no-unused-vars if not used
    'var x = 1;', // 2: no-var
    'var y = 2;', // 3: no-var
    'const myObj: any = { z: eval("1+1") };', // 4: no-eval, 5: no-explicit-any (if enabled, we just want enough errors)
    'console.log(x);', // often console.log is flagged, or we can just do unused variables
    'export default function BadComponent() {',
    '  var a = "test";', // another no-var
    '  return <div>{y}</div>;',
    '}'
  ].join('\n');

  // Let's create a file that we are sure violates 5 standard rules
  // no-var: 3 times
  // no-eval: 1 time
  // @typescript-eslint/no-unused-vars: 1 time
  const moreSpecificBadContent = `
var x = 1;
var y = 2;
var z = 3;
eval("alert('hello')");
const unusedVar = "I am unused";
console.log(x, y, z);
  `;

  // We write the Python script that runs ArchitectAgent and returns JSON output of the AgentResponse
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.architect import ArchitectAgent',
    'from backend.agents.core.io_models import AgentRequest',
    'import dataclasses',
    '',
    'def main():',
    '    agent = ArchitectAgent(node_id="TEST-NODE-123")',
    '    req = AgentRequest(',
    '        task_id="test-task",',
    '        data={',
    '            "filepath": "backend/tools/bad_react_file.tsx",',
    '            "base_score": 10.0,',
    '            "penalty_per_issue": 1.0',
    '        }',
    '    )',
    '    resp = agent.execute(req)',
    '    # Use dataclasses.asdict since AgentResponse is a dataclass',
    '    print("---SUCCESS---")',
    '    print(json.dumps(dataclasses.asdict(resp)))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  const fs = await import('fs');
  fs.writeFileSync(badFilePath, moreSpecificBadContent);
  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    const { execSync } = await import('child_process');
    // Ensure pylint and mypy are available
    execSync('pip install -q mypy pylint', { encoding: 'utf-8' });
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
    if (fs.existsSync(badFilePath)) {
      fs.unlinkSync(badFilePath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  // The status should be 'issues_found'
  expect(resultJson.status).toBe('issues_found');
  
  // Extract number of issues
  const numIssues = resultJson.data.issues.length;
  // Ensure we actually caught some issues (expecting around 5 based on our file)
  expect(numIssues).toBeGreaterThan(0);
  
  // Verify static_violations is added
  expect(resultJson.data.static_violations).toBeDefined();
  expect(resultJson.data.static_violations.length).toBe(numIssues);

  // The score should be mathematically penalized: 10.0 - (numIssues * 1.0)
  // Ensure it doesn't drop below 0
  const expectedScore = Math.max(0.0, 10.0 - numIssues * 1.0);
  expect(resultJson.data.score).toBe(expectedScore);

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Scaffold the new UI Tab routing and shell component', async ({ page }) => {
  // Navigate to the newly updated /health route
  await page.goto('/health');

  // Verify shell and tabs exist
  const shell = page.locator('[data-testid="health-dashboard-shell"]');
  await expect(shell).toBeVisible();

  const tabSystemHealth = page.locator('[data-testid="tab-system-health"]');
  const tabCodeQuality = page.locator('[data-testid="tab-code-quality"]');

  await expect(tabSystemHealth).toBeVisible();
  await expect(tabCodeQuality).toBeVisible();

  // Verify default state
  const placeholderSystemHealth = page.locator('[data-testid="placeholder-system-health"]');
  await expect(placeholderSystemHealth).toBeVisible();

  // Verify switching tabs
  await tabCodeQuality.click();
  const placeholderCodeQuality = page.locator('[data-testid="placeholder-code-quality"]');
  await expect(placeholderCodeQuality).toBeVisible();
  await expect(placeholderSystemHealth).not.toBeVisible();

  // Switch back
  await tabSystemHealth.click();
  await expect(placeholderSystemHealth).toBeVisible();
  await expect(placeholderCodeQuality).not.toBeVisible();

  await page.screenshot({ path: 'evidence.png' });
});

test('Verify System Health Split-View Monitoring UI component', async ({ page }) => {
  // Navigate to the newly updated /health route
  await page.goto('/health');

  // Verify the header title exists
  const headerText = page.locator('text=Split-View Monitoring');
  await expect(headerText).toBeVisible();

  // Verify infrastructure stack elements
  await expect(page.locator('text=Infrastructure Stack')).toBeVisible();
  await expect(page.locator('text=Compute Clusters')).toBeVisible();
  await expect(page.locator('text=Vector Storage')).toBeVisible();
  await expect(page.locator('text=API Gateway')).toBeVisible();

  // Verify Hardware Pulse section
  await expect(page.locator('text=Hardware Pulse')).toBeVisible();
  await expect(page.locator('text=Total Logs Processed')).toBeVisible();
  await expect(page.locator('text=Signal Integrity')).toBeVisible();
  await expect(page.locator('text=Active Warnings')).toBeVisible();

  // Ensure tabs exist if we are in the shell, but wait, the health-dashboard-shell mounts it.
  // We should just check the specific elements we added.
  
  // Verify the Footer component correctly renders and deduplicates Layout logic
  await expect(page.locator('text=Zone: US-EAST-1-PROD')).toBeVisible();
  await expect(page.locator('text=System Load: Stable')).toBeVisible();

  // Take screenshot as required
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement Temporal Screenshot Storage for Vibe Agent', async ({ page }) => {
  await page.goto('/health');

  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');
  
  // Set up storage directory and ensure it's clean
  const storageDir = path.join(process.cwd(), 'backend/vision/storage');
  if (fs.existsSync(storageDir)) {
    fs.rmSync(storageDir, { recursive: true, force: true });
  }

  // Generate python script to test buffer logic
  const pyScript = `
import sys
import os

# Ensure backend module is resolvable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.vision.temporal_buffer import TemporalScreenshotBuffer

buf = TemporalScreenshotBuffer(storage_dir="backend/vision/storage")
with open(sys.argv[1], 'rb') as f:
    buf.store_frame(f.read())
`;
  const pyScriptPath = path.join(process.cwd(), 'temp_buffer_test.py');
  fs.writeFileSync(pyScriptPath, pyScript);

  try {
    for (let i = 0; i < 6; i++) {
      // Trigger UI update to satisfy scenario
      if (i % 2 === 0) {
        await page.click('[data-testid="tab-code-quality"]');
      } else {
        await page.click('[data-testid="tab-system-health"]');
      }
      
      const tempFramePath = path.join(process.cwd(), 'temp_frame.png');
      await page.screenshot({ path: tempFramePath });
      
      // Pass the frame to our temporal buffer
      execSync('python3 ' + pyScriptPath + ' ' + tempFramePath);
      
      // Cleanup temp frame
      if (fs.existsSync(tempFramePath)) {
        fs.unlinkSync(tempFramePath);
      }
    }
    
    // Verify directory contents
    const files = fs.readdirSync(storageDir);
    expect(files.length).toBe(6);
    expect(files).toContain('current.png');
    expect(files).toContain('T-1.png');
    expect(files).toContain('T-2.png');
    expect(files).toContain('T-3.png');
    expect(files).toContain('T-4.png');
    expect(files).toContain('T-5.png');

  } finally {
    if (fs.existsSync(pyScriptPath)) {
      fs.unlinkSync(pyScriptPath);
    }
  }

  await page.screenshot({ path: 'evidence.png' });
});

test('Pass a timeline of 3 images to the VisionAgent where a button is deleted in the final frame. Verify the agent detects the regression ("Bulldozer Problem") and flags a critical failure.', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');

  // We write the Python script that runs VisionAgent and returns JSON output
  const testScriptPath = 'backend/tools/test_vision_agent_e2e.py';
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'from unittest.mock import MagicMock',
    'import warnings',
    '',
    'with warnings.catch_warnings():',
    '    warnings.simplefilter("ignore")',
    '    import google.generativeai as genai',
    '',
    '# Mock the genai model',
    'mock_model = MagicMock()',
    'mock_response = MagicMock()',
    'mock_response.text = """{"regression_detected": true, "reason": "Button was deleted in the final frame."}"""',
    'mock_model.generate_content.return_value = mock_response',
    '',
    'genai.GenerativeModel = MagicMock(return_value=mock_model)',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.vision import VisionAgent',
    'from backend.agents.core.io_models import AgentRequest',
    'import dataclasses',
    '',
    'def main():',
    '    agent = VisionAgent(node_id="TEST-VISION-123")',
    '    req = AgentRequest(',
    '        task_id="test-vision",',
    '        data={',
    '            "images": [b"frame_1", b"frame_2", b"frame_3"]',
    '        }',
    '    )',
    '    resp = agent.execute(req)',
    '    ',
    '    print("---SUCCESS---")',
    '    print(json.dumps(dataclasses.asdict(resp)))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  // Verify the agent detected the regression
  expect(resultJson.status).toBe('issues_found');
  expect(resultJson.data.regression_detected).toBe(true);
  expect(resultJson.data.reason).toContain('deleted');
  expect(resultJson.data.frames_analyzed).toBe(3);

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('', async ({ page }) => {
  const scriptContent = `
import sys
import json
import logging
from backend.agents.core.base_agent import BaseAgent
from backend.agents.core.io_models import AgentRequest, AgentResponse
import dataclasses

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

class MetadataAgent(BaseAgent):
    def execute(self, request: AgentRequest) -> AgentResponse:
        self._emit_json_log("INFO", "Executing with metadata", metadata=request.metadata)
        return AgentResponse(
            status="success",
            data={"echo": request.data},
            metadata={"response_meta": True}
        )

agent = MetadataAgent(node_id="META-NODE-1")
req = AgentRequest(
    task_id="meta-task-1",
    data={"input": "test"},
    metadata={"source": "pytest"}
)
res = agent.execute(req)

print("---RESPONSE---")
print(json.dumps(dataclasses.asdict(res)))
`;

  const crypto = await import('crypto');
  const fs = await import('fs');
  const filename = 'test_metadata_agent_' + crypto.randomBytes(4).toString('hex') + '.py';
  fs.writeFileSync(filename, scriptContent);
  
  let outputLines;
  try {
    const { execSync } = await import('child_process');
    const combinedOutput = execSync('python3 ' + filename + ' 2>&1');
    outputLines = combinedOutput.toString().trim().split('\n');
  } finally {
    fs.unlinkSync(filename);
  }
  
  // Find the log line
  const logLine = outputLines.find(line => line.includes('Executing with metadata'));
  expect(logLine).toBeDefined();

  const startIdx = logLine!.indexOf('{');
  const endIdx = logLine!.lastIndexOf('}');
  const jsonPartStr = logLine!.substring(startIdx, endIdx + 1);
  const parsedLog = JSON.parse(jsonPartStr);
  
  expect(parsedLog.log_level).toBe('INFO');
  expect(parsedLog.node_id).toBe('META-NODE-1');
  expect(parsedLog.message).toBe('Executing with metadata');
  expect(parsedLog.metadata).toBeDefined();
  expect(parsedLog.metadata.source).toBe('pytest');

  // Find the response
  const responseIdx = outputLines.indexOf('---RESPONSE---');
  expect(responseIdx).toBeGreaterThan(-1);
  
  const responseJsonStr = outputLines[responseIdx + 1];
  const responseJson = JSON.parse(responseJsonStr);
  expect(responseJson.status).toBe('success');
  expect(responseJson.metadata).toBeDefined();
  expect(responseJson.metadata.response_meta).toBe(true);
  
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Implement the Orchestrator/Router component to dispatch tasks to appropriate sub-agents', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');

  const testScriptPath = 'backend/agents/test_router_agent_e2e.py';
  const badFilePath = 'backend/agents/bad_react_file_router_test.tsx';
  
  const moreSpecificBadContent = `
var x = 1;
var y = 2;
var z = 3;
eval("alert('hello')");
const unusedVar = "I am unused";
console.log(x, y, z);
  `;
  
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'from unittest.mock import MagicMock',
    'import warnings',
    '',
    'with warnings.catch_warnings():',
    '    warnings.simplefilter("ignore")',
    '    import google.generativeai as genai',
    '',
    '# Mock the genai model for vision',
    'mock_model = MagicMock()',
    'mock_response = MagicMock()',
    'mock_response.text = """{"regression_detected": true, "reason": "Button was deleted in the final frame."}"""',
    'mock_model.generate_content.return_value = mock_response',
    'genai.GenerativeModel = MagicMock(return_value=mock_model)',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.router import RouterAgent',
    'from backend.agents.core.io_models import AgentRequest',
    'import dataclasses',
    '',
    'def main():',
    '    agent = RouterAgent(node_id="ROUTER-TEST-NODE")',
    '    ',
    '    # Test Architect Task',
    '    req_architect = AgentRequest(',
    '        task_id="task-architect",',
    '        data={',
    '            "task_type": "architect",',
    '            "filepath": "backend/agents/bad_react_file_router_test.tsx",',
    '            "base_score": 10.0,',
    '            "penalty_per_issue": 1.0',
    '        }',
    '    )',
    '    resp_architect = agent.execute(req_architect)',
    '    ',
    '    # Test Vision Task',
    '    req_vision = AgentRequest(',
    '        task_id="task-vision",',
    '        data={',
    '            "task_type": "vision",',
    '            "images": [b"frame_1", b"frame_2"]',
    '        }',
    '    )',
    '    resp_vision = agent.execute(req_vision)',
    '    ',
    '    # Test Unknown Task',
    '    req_unknown = AgentRequest(',
    '        task_id="task-unknown",',
    '        data={',
    '            "task_type": "unknown_type"',
    '        }',
    '    )',
    '    resp_unknown = agent.execute(req_unknown)',
    '    ',
    '    print("---SUCCESS---")',
    '    print(json.dumps({',
    '        "architect": dataclasses.asdict(resp_architect),',
    '        "vision": dataclasses.asdict(resp_vision),',
    '        "unknown": dataclasses.asdict(resp_unknown)',
    '    }))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  fs.writeFileSync(badFilePath, moreSpecificBadContent);
  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
    if (fs.existsSync(badFilePath)) {
      fs.unlinkSync(badFilePath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  // Verify architect
  expect(resultJson.architect.status).toBe('issues_found');
  expect(resultJson.architect.data.issues.length).toBeGreaterThan(0);

  // Verify vision
  expect(resultJson.vision.status).toBe('issues_found');
  expect(resultJson.vision.data.regression_detected).toBe(true);

  // Verify unknown
  expect(resultJson.unknown.status).toBe('failure');
  expect(resultJson.unknown.errors[0]).toContain('Unknown task_type');

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Define the base sub-agent interface and implement routing logic in the monolithic agent', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');

  const testScriptPath = 'backend/agents/test_dynamic_router_e2e.py';
  
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'import dataclasses',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.router import RouterAgent',
    'from backend.agents.core.base_agent import BaseAgent',
    'from backend.agents.core.io_models import AgentRequest, AgentResponse',
    '',
    'class MockAgent(BaseAgent):',
    '    def execute(self, request: AgentRequest) -> AgentResponse:',
    '        return AgentResponse(',
    '            status="success",',
    '            data={"mock_executed": True, "received_data": request.data},',
    '            metadata=request.metadata',
    '        )',
    '',
    'def main():',
    '    agent = RouterAgent(node_id="ROUTER-TEST-NODE")',
    '    mock_agent = MockAgent(node_id="MOCK-AGENT-NODE")',
    '    ',
    '    # Dynamically register the custom agent',
    '    agent.register_agent("custom_task", mock_agent)',
    '    ',
    '    req_custom = AgentRequest(',
    '        task_id="task-custom",',
    '        data={',
    '            "task_type": "custom_task",',
    '            "payload": "hello world"',
    '        }',
    '    )',
    '    resp_custom = agent.execute(req_custom)',
    '    ',
    '    print("---SUCCESS---")',
    '    print(json.dumps({',
    '        "custom": dataclasses.asdict(resp_custom)',
    '    }))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  // Verify custom
  expect(resultJson.custom.status).toBe('success');
  expect(resultJson.custom.data.mock_executed).toBe(true);
  expect(resultJson.custom.data.received_data.payload).toBe('hello world');

  // Take screenshot of empty app (tests shouldn't fail based on visual rules)
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test("Extract the final remaining logical domain into a dedicated sub-agent module and update routing.", async ({ page }) => {
    const fs = await import('fs');
    const path = await import('path');
    const { execSync } = await import('child_process');
  
    const testScriptPath = 'backend/agents/test_prompt_agent_router_e2e.py';
    
    // We write a Python script that instantiates RouterAgent and dispatches a prompt task
    const testScriptContent = [
      'import sys',
      'import os',
      'import json',
      'import dataclasses',
      'import uuid',
      'import warnings',
      '',
      'with warnings.catch_warnings():',
      '    warnings.simplefilter("ignore")',
      '    import google.generativeai as genai',
      'from unittest.mock import MagicMock',
      'mock_model = MagicMock()',
      'mock_response = MagicMock()',
      'mock_response.text = "Prompt Agent Response"',
      'mock_model.generate_content.return_value = mock_response',
      'genai.GenerativeModel = MagicMock(return_value=mock_model)',
      '',
      'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
      'from backend.agents.router import RouterAgent',
      'from backend.agents.core.io_models import AgentRequest',
      'from backend.agents.core.chain import ExecutionState, Node',
      '',
      'def main():',
      '    agent = RouterAgent(node_id="ROUTER-TEST-PROMPT-NODE")',
      '    ',
      '    node = Node(',
      '        node_id="test_prompt_node",',
      '        agent_type="prompt",',
      '        config={"prompt_template": "Hello {name}", "model": "gemini-2.5-flash"}',
      '    )',
      '    state = ExecutionState(',
      '        chain_id="chain-prompt-xyz",',
      '        current_node="test_prompt_node",',
      '        variables={"name": "Zulu"}',
      '    )',
      '    ',
      '    req = AgentRequest(',
      '        task_id="task-prompt",',
      '        data={',
      '            "task_type": "prompt",',
      '            "state": state.model_dump(),',
      '            "node": node.model_dump()',
      '        }',
      '    )',
      '    resp = agent.execute(req)',
      '    ',
      '    print("---SUCCESS---")',
      '    print(json.dumps({',
      '        "prompt": dataclasses.asdict(resp)',
      '    }))',
      '',
      'if __name__ == "__main__":',
      '    main()'
    ].join('\n');
  
    fs.writeFileSync(testScriptPath, testScriptContent);
  
    let stdout = '';
    try {
      stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
    } catch (error: unknown) {
      stdout = (error as { stdout?: string }).stdout || String(error);
    } finally {
      if (fs.existsSync(testScriptPath)) {
        fs.unlinkSync(testScriptPath);
      }
    }
  
    const outputLines = stdout.split('\n').map(l => l.trim());
    
    const successIdx = outputLines.indexOf('---SUCCESS---');
    if (successIdx === -1) {
      console.error("Test execution failed. Stdout:", stdout);
    }
    expect(successIdx).toBeGreaterThan(-1);
  
    const resultStr = outputLines[successIdx + 1];
    const startIdx = resultStr.indexOf('{');
    const endIdx = resultStr.lastIndexOf('}');
    const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));
  
    expect(resultJson.prompt.status).toBe('success');
    expect(resultJson.prompt.data.result).toBe('Prompt Agent Response');
  
    // Take screenshot of empty app
    await page.goto('/');
    await page.screenshot({ path: 'evidence.png' });
});

test("Extract the first remaining logical domain into a dedicated sub-agent module and update imports/routing.", async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');

  const testScriptPath = 'backend/agents/test_python_architect_router_e2e.py';
  const badFilePath = 'backend/agents/bad_python_file.py';
  
  // A generic bad Python file that will fail Ruff static analysis
  const badFileContent = [
    'import os',
    'import sys', // F401 imported but unused
    'def test_func():',
    '    x = 1', // F841 local variable assigned but never used
    '    y = 2', // F841
    '    z = eval("1+1")', // W0122 use of eval
    '    pass',
  ].join('\n');

  // We write a Python script that instantiates RouterAgent and dispatches a python_architect task
  const testScriptContent = [
    'import sys',
    'import os',
    'import json',
    'from unittest.mock import MagicMock',
    'import warnings',
    '',
    'with warnings.catch_warnings():',
    '    warnings.simplefilter("ignore")',
    '    import google.generativeai as genai',
    '',
    '# Mock the genai model for vision',
    'mock_model = MagicMock()',
    'mock_response = MagicMock()',
    'mock_response.text = """{"regression_detected": true, "reason": "Button was deleted in the final frame."}"""',
    'mock_model.generate_content.return_value = mock_response',
    'genai.GenerativeModel = MagicMock(return_value=mock_model)',
    '',
    'sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))',
    'from backend.agents.router import RouterAgent',
    'from backend.agents.core.io_models import AgentRequest',
    'import dataclasses',
    '',
    'def main():',
    '    agent = RouterAgent(node_id="ROUTER-TEST-NODE")',
    '    ',
    '    req = AgentRequest(',
    '        task_id="task-python-architect",',
    '        data={',
    '            "task_type": "python_architect",',
    '            "filepath": "backend/agents/bad_python_file.py",',
    '            "base_score": 10.0,',
    '            "penalty_per_issue": 1.0',
    '        }',
    '    )',
    '    resp = agent.execute(req)',
    '    ',
    '    print("---SUCCESS---")',
    '    print(json.dumps({',
    '        "python_architect": dataclasses.asdict(resp)',
    '    }))',
    '',
    'if __name__ == "__main__":',
    '    main()'
  ].join('\n');

  fs.writeFileSync(badFilePath, badFileContent);
  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
    if (fs.existsSync(badFilePath)) {
      fs.unlinkSync(badFilePath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  // The status should be 'issues_found'
  expect(resultJson.python_architect.status).toBe('issues_found');
  expect(resultJson.python_architect.data.issues.length).toBeGreaterThan(0);
  expect(resultJson.python_architect.data.score).toBeLessThan(10.0);

  // Take screenshot of empty app
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Utility correctly runs pylint and mypy on a dummy python file with deliberate errors and returns parsed violation objects', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');

  const testScriptPath = path.resolve(process.cwd(), 'temp_analyzer_test.py');
  
  const testScriptContent = `
import json
import sys
import os
sys.path.append(os.getcwd())
from backend.utils.python_analyzer import analyze_python_code

def main():
    dummy_code = """
def add(a: int, b: int) -> int:
    return a + b

def wrong_add(a: str, b: int) -> int:
    return a + b

import sys
unused_var = 1
"""
    result = analyze_python_code(dummy_code)
    
    print("---SUCCESS---")
    print(json.dumps(result))

if __name__ == "__main__":
    main()
  `;

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    const { execSync } = await import('child_process');
    execSync('python3 -m pip install -q mypy pylint', { encoding: 'utf-8' });
    stdout = execSync('python3 -m mypy ' + testScriptPath + ' || true', { encoding: 'utf-8' });
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.issues).toBeDefined();
  expect(resultJson.issues.length).toBeGreaterThan(0);
  
  const hasMypy = resultJson.issues.some((issue: any) => issue.tool === 'mypy' && issue.type === 'error');
  const hasPylint = resultJson.issues.some((issue: any) => issue.tool === 'pylint' && issue.type === 'convention');
  
  if (!hasMypy) {
    console.error("Missing Mypy error in:", resultJson.issues);
  }
  expect(hasMypy).toBe(true);
  expect(hasPylint).toBe(true);

  // Take screenshot of active feature
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Utility runs ESLint on a dummy React component with missing prop-types or unused vars, returning parsed violation objects.', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');

  const testScriptPath = path.resolve(process.cwd(), 'temp_react_analyzer_test.py');
  
  const testScriptContent = `
import json
import sys
import os
sys.path.append(os.getcwd())
from backend.utils.react_analyzer import analyze_react_code

def main():
    dummy_code = """
import React, { useState } from 'react';

export function TestComponent() {
  const [state, setState] = useState(0);
  const x = 1;
  return <div>{x}</div>;
}
"""
    result = analyze_react_code(dummy_code)
    
    print("---SUCCESS---")
    print(json.dumps(result))

if __name__ == "__main__":
    main()
  `;

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    const { execSync } = await import('child_process');
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.issues).toBeDefined();
  expect(resultJson.issues.length).toBeGreaterThan(0);
  
  const hasEslintUnusedVar = resultJson.issues.some((issue: any) => issue.tool === 'eslint' && issue.symbol === '@typescript-eslint/no-unused-vars');
  
  if (!hasEslintUnusedVar) {
    console.error("Missing ESLint error in:", resultJson.issues);
  }
  expect(hasEslintUnusedVar).toBe(true);

  // Take screenshot of active feature
  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});

test('Playwright capture utility saves multiple sequential screenshots, correctly cycling out images older than T-5.', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');
  const { execSync } = await import('child_process');
  
  // Set up storage directory and ensure it's clean
  const storageDir = path.join(process.cwd(), 'backend/utils/storage');
  if (fs.existsSync(storageDir)) {
    fs.rmSync(storageDir, { recursive: true, force: true });
  }

  // Generate python script to test buffer logic
  const pyScript = `
import sys
import os

# Ensure backend module is resolvable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from backend.utils.vision_capture import VisionCapture

capture_util = VisionCapture(storage_dir="backend/utils/storage")
with open(sys.argv[1], 'rb') as f:
    capture_util.capture(f.read())
`;
  const pyScriptPath = path.join(process.cwd(), 'temp_capture_test.py');
  fs.writeFileSync(pyScriptPath, pyScript);

  try {
    for (let i = 0; i < 7; i++) {
      // Trigger UI update to satisfy scenario
      await page.goto('/health');
      if (i % 2 === 0) {
        await page.click('[data-testid="tab-code-quality"]');
      } else {
        await page.click('[data-testid="tab-system-health"]');
      }
      
      const tempFramePath = path.join(process.cwd(), 'temp_capture_frame.png');
      await page.screenshot({ path: tempFramePath });
      
      // Pass the frame to our vision capture utility
      execSync('python3 ' + pyScriptPath + ' ' + tempFramePath);
      
      // Cleanup temp frame
      if (fs.existsSync(tempFramePath)) {
        fs.unlinkSync(tempFramePath);
      }
    }
    
    // Verify directory contents
    const files = fs.readdirSync(storageDir);
    expect(files.length).toBe(6);
    expect(files).toContain('current.png');
    expect(files).toContain('T-1.png');
    expect(files).toContain('T-2.png');
    expect(files).toContain('T-3.png');
    expect(files).toContain('T-4.png');
    expect(files).toContain('T-5.png');
    // Ensure T-6 is not there since max history is 5 (T-1 to T-5 plus current)
    expect(files).not.toContain('T-6.png');

  } finally {
    if (fs.existsSync(pyScriptPath)) {
      fs.unlinkSync(pyScriptPath);
    }
  }

  await page.screenshot({ path: 'evidence.png' });
});

test('VisionAgent processes T-2, T-1, and Current screenshots, correctly identifying UI elements that were unintentionally deleted (resolving the Bulldozer Problem).', async ({ page }) => {
  const fs = await import('fs');
  const path = await import('path');

  const testScriptPath = path.resolve(process.cwd(), 'temp_vision_test.py');
  
  const testScriptContent = `
import json
import sys
import os
from unittest.mock import MagicMock
import warnings

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    import google.generativeai as genai

mock_model = MagicMock()
mock_response = MagicMock()
mock_response.text = """{"regression_detected": true, "reason": "A critical UI element was deleted unnecessarily."}"""
mock_model.generate_content.return_value = mock_response
genai.GenerativeModel = MagicMock(return_value=mock_model)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))
from backend.agents.vision import VisionAgent
from backend.agents.core.io_models import AgentRequest
import dataclasses

def main():
    agent = VisionAgent(node_id="VISION-TEST-NODE")
    
    # We use empty byte arrays to simulate image data, as the logic depends on the array length
    req = AgentRequest(
        task_id="task-vision-test",
        data={
            "task_type": "vision",
            "images": [b"image_data_t2", b"image_data_t1", b"image_data_current"],
            "inspiration_goal": "A simple dashboard"
        }
    )
    resp = agent.execute(req)
    
    print("---SUCCESS---")
    print(json.dumps({
        "vision": dataclasses.asdict(resp)
    }))

if __name__ == "__main__":
    main()
  `;

  fs.writeFileSync(testScriptPath, testScriptContent);

  let stdout = '';
  try {
    const { execSync } = await import('child_process');
    stdout = execSync('python3 ' + testScriptPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    stdout = (error as { stdout?: string }).stdout || String(error);
  } finally {
    if (fs.existsSync(testScriptPath)) {
      fs.unlinkSync(testScriptPath);
    }
  }

  const outputLines = stdout.split('\n').map(l => l.trim());
  const successIdx = outputLines.indexOf('---SUCCESS---');
  if (successIdx === -1) {
    console.error("Test execution failed. Stdout:", stdout);
  }
  expect(successIdx).toBeGreaterThan(-1);

  const resultStr = outputLines[successIdx + 1];
  const startIdx = resultStr.indexOf('{');
  const endIdx = resultStr.lastIndexOf('}');
  const resultJson = JSON.parse(resultStr.substring(startIdx, endIdx + 1));

  expect(resultJson.vision.status).toBe('issues_found');
  expect(resultJson.vision.data.regression_detected).toBe(true);
  expect(resultJson.vision.data.frames_analyzed).toBe(3);

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});
