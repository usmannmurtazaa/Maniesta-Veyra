import { test, expect } from '@playwright/test';

test('custom print studio flow', async ({ page }) => {
  await page.goto('/custom-shirts');
  await page.click('text=Start Designing');
  await expect(page).toHaveURL('/customize');

  // Step 1: Select garment
  await page.locator('text=Classic T-Shirt').click();
  await page.click('text=Next');

  // Step 2: Select color
  await page.locator('[data-testid="color-selector"] button').first().click();
  await page.click('text=Next');

  // Step 3: Select size
  await page.locator('[data-testid="size-selector"] button').first().click();
  await page.click('text=Next');

  // Step 4: Select print location
  await page.locator('[data-testid="print-location-selector"] label').first().click();
  await page.click('text=Next');

  // Step 5: Upload design (skip if no file)
  // We'll assume upload is skipped in test; but we need to continue.
  await page.click('text=Next');

  // Step 6: Position design (canvas)
  await page.click('text=Next');

  // Step 7: Review
  await page.click('text=Add to Cart');
  await expect(page).toHaveURL('/cart');
});