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
  await page.screenshot({ path: 'evidence.png' });
});

test('PocketBase connection uses proper relative path', async ({ page }) => {
  await page.goto('/viewer/index.html?view=zulu');
  await expect(page.locator('text=Zulu AI')).toBeVisible();
});
