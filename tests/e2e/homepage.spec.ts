import { test, expect } from '@playwright/test';

test('homepage shows Maniesta Veyra branding', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Maniesta Veyra/);
  await expect(page.locator('h1')).toContainText('Maniesta Veyra');
});