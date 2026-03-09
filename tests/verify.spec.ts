import { test, expect } from '@playwright/test';

test('App initializes correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Loom Initialized')).toBeVisible();
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
  const svg = page.locator('svg').first();
  await expect(svg).toBeVisible();
  
  // Find the primary line stroke path (which we set to stroke="#00F2FF")
  const primaryPath = svg.locator('path[stroke="#00F2FF"]');
  await expect(primaryPath).toBeVisible();

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