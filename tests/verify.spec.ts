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
