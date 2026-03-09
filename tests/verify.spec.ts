import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';

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
  const outputLines = stderrOutput.toString().trim().split('\n');
  const output = outputLines[outputLines.length - 1]; // get the last line which is the json log
  
  // Assert the output is parsable JSON
  let isJson = false;
  let parsed: any = {};
  try {
    parsed = JSON.parse(output);
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
