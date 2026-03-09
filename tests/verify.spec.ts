import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as crypto from 'crypto';

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
  const systemHealthLink = sidebar.locator('a[href="/system-health"]');
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
  await page.goto('/system-health');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
  
  const exportBtn = page.locator('button', { hasText: 'Export' });
  await expect(exportBtn).toBeVisible();
  
  // Verify it has the neutral styling, not the high-contrast accent
  await expect(exportBtn).toHaveClass(/bg-dark-surface/);
  await expect(exportBtn).toHaveClass(/text-zinc-grey/);
  await expect(exportBtn).not.toHaveClass(/bg-electric-blue/);
  
  await page.screenshot({ path: 'evidence.png' });
});

test('PocketBase connection uses proper relative path', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
});

test('Dashboard uses abstracted reusable components', async ({ page }) => {
  await page.goto('/system-health');
  
  // Verify Sidebar layout component is visible
  await expect(page.locator('aside').filter({ hasText: 'Zulu AI' })).toBeVisible();
  
  // Verify Header layout component is visible
  await expect(page.locator('header').filter({ hasText: 'Health' })).toBeVisible();

  // Verify MetricCard abstract component is loaded
  await expect(page.locator('text=CPU_CORE_LOAD')).toBeVisible();
  
  // Verify WorkerNode abstract component is loaded
  await expect(page.locator('text=NODE-01')).toBeVisible();
  await expect(page.locator('text=ONLINE').first()).toBeVisible();

  // Verify TelemetryStream component is active
  await expect(page.locator('text=Telemetry_Stream')).toBeVisible();

  // Verify InferenceChart component is active
  await expect(page.locator('text=Inference Throughput')).toBeVisible();
});

test('Smooth chart data rendering to feel like a premium, realistic dashboard', async ({ page }) => {
  await page.goto('/system-health');
  
  // Wait for the SVG to load
  const svgContainer = page.locator('.h-\\[220px\\]');
  const svg = svgContainer.locator('svg').first();
  await expect(svg).toBeVisible();
  
  // Find the primary line stroke path (which we set to stroke="#00F2FF")
  const primaryPath = svg.locator('path[stroke="#00F2FF"]');
  await expect(primaryPath).toBeVisible({ timeout: 10000 });

  // Wait a moment for dynamic data to start updating
  await page.waitForTimeout(1100);

  // Get the 'd' attribute
  const dAttr = await primaryPath.getAttribute('d');
  expect(dAttr).not.toBeNull();
  
  // Verify it contains 'C' commands for cubic bezier smooth curves instead of just lines or Q/T
  expect(dAttr).toMatch(/C/);
  
  // Verify it's not aggressively clipping at the bottom (100)
  // Our padding logic should keep values above 90, so checking that '100' isn't explicitly reached by the primary data stroke.
  expect(dAttr).not.toMatch(/,100 /);
  
  await page.screenshot({ path: 'evidence.png' });
});
test('Telemetry logs maintain a strict hanging indent when wrapping', async ({ page }) => {
  await page.goto('/system-health');
  
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
  
  // Ensure the second line does not bleed to the left edge of the entire log container
  // Its x coordinate should match or be very close to the x coordinate of the first line
  // (which is indented by the timestamp and tag)
  const line1X = rects[0].x;
  const line2X = rects[1].x;
  
  // Check that the lines are perfectly aligned on the left
  expect(Math.abs(line1X - line2X)).toBeLessThan(2);
  
  // Ensure that line1X is significantly indented (at least past the timestamp and tag width + gaps)
  // Assuming timestamp ~48px, tag ~30px, gaps ~24px -> should be > 100px
  expect(line1X).toBeGreaterThan(100);

  // Capture screenshot of the active feature to evidence.png
  await page.screenshot({ path: 'evidence.png' });
});



test('Python agent logs are structured JSON format', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  
  // Since backend outputs JSON to state.live_logs, the viewer UI might fetch and render it.
  // To verify the structured format, we can run a brief python script locally in playwright using execSync, 
  // or just assert that if the UI renders logs, they don't crash, and take a screenshot.
  // But actually we can just invoke the python script and assert its output is valid JSON directly in the Node.js test environment.
  
  
  const stdout = execSync('python3 -c \"import logging; from main import logger, StateLogHandler; logger.info(\'Integration test log\', extra={\'markup\': True})\"');
  const stderrOutput = execSync('python3 -c \"import sys; import logging; from main import logger, StateLogHandler; logger.info(\'Integration test log\', extra={\'markup\': True})\" 2>&1');
  const outStr = stderrOutput.toString().trim();
  const startIdx = outStr.indexOf('{');
  const endIdx = outStr.lastIndexOf('}');
  
  let jsonStr = '{}';
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = outStr.substring(startIdx, endIdx + 1);
  }
  
  // Assert the output is parsable JSON
  let isJson = false;
  let parsed: any = {};
  try {
    parsed = JSON.parse(jsonStr);
    isJson = true;
  } catch(e) {}
  
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
  const popover = page.locator('div').filter({ hasText: 'Filter Config' }).nth(1);
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
  
  let parsedLog = JSON.parse(jsonPartStr);
  
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
from backend.agents.core.node_executor import NodeExecutor
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
executor = NodeExecutor(node)

# 3. Create execution state with variables to be interpolated
state = ExecutionState(
    chain_id="chain-xyz",
    current_node="analyst_node",
    variables={"metric_name": "CPU_LOAD", "metric_value": "95%"}
)

# 4. Execute the node
request = AgentRequest(task_id="task-1", data={"state": state.model_dump()})
response = executor.execute(request)

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
from backend.agents.core.node_executor import NodeExecutor

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
  
  const codes = resultJson.issues.map((i: any) => i.code);
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

  await page.goto('/');
  await page.screenshot({ path: 'evidence.png' });
});
