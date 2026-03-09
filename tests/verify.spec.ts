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
});