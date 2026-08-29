import { test, expect } from '@playwright/test';

test.describe('Ops Admin Catalog Workflow', () => {
  test('Complete Manufacturer to Product pipeline', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // PHASE 7: Ops Admin Pipeline
    
    // 1. Manufacturer Creation
    await test.step('Create Manufacturer', async () => {
      await page.goto('/ops/catalog/manufacturers');
      await page.waitForLoadState('networkidle');
      
      await page.getByRole('button', { name: /Add Manufacturer/i }).click();
      
      const modal = page.locator('.fixed.inset-0');
      await expect(modal).toBeVisible();
      
      await modal.locator('input').nth(0).fill('Playwright OEM');
      await modal.locator('input').nth(1).fill('Germany');
      await modal.getByRole('button', { name: /Save/i }).click();
      
      await expect(modal).not.toBeVisible();
      
      // Verify persistence
      await expect(page.locator('td:has-text("Playwright OEM")').first()).toBeVisible();
      await page.reload();
      await expect(page.locator('td:has-text("Playwright OEM")').first()).toBeVisible();
    });

    // 2. Category Creation
    await test.step('Create Category', async () => {
      await page.goto('/ops/catalog/categories/new');
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[name="name"]', 'Playwright Drones');
      await page.fill('textarea[name="description"]', 'Drones for E2E testing');
      
      // Wait for navigation after submit
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: /Create Category/i }).click()
      ]);
      
      await expect(page.url()).toContain('/ops/catalog/categories');
    });

    // 3. Product Creation
    await test.step('Create Canonical Product', async () => {
      await page.goto('/ops/catalog/products/new');
      await page.waitForLoadState('networkidle');
      
      // Step 1: Manufacturer & Category
      await page.locator('select').nth(0).selectOption({ label: 'Playwright OEM' });
      await page.locator('select').nth(1).selectOption({ label: 'Playwright Drones' });
      await page.getByRole('button', { name: /Next/i }).click();

      // Step 2: Basic Info
      await page.locator('input').nth(0).fill('Playwright Motor X1');
      await page.locator('input').nth(1).fill('PW-X1-400');
      await page.locator('textarea').fill('A robust motor for E2E tests.');
      
      // I recently added imageUrl to the Wizard at the end of Step 2!
      await page.locator('input[placeholder="e.g. https://example.com/image.png"]').fill('https://example.com/pw-image.png');
      
      await page.getByRole('button', { name: /Next/i }).click();

      // Step 3: Variants & Specs
      await page.locator('input[placeholder="e.g. Standard, 400KV, Pro"]').fill('400KV');
      await page.locator('input[placeholder="e.g. SKU-1234"]').fill('PW-X1-400-SKU');
      await page.getByRole('button', { name: /Create Product/i }).click();

      // Verify redirection to catalog
      await page.waitForURL('**/ops/catalog/products*');
      await expect(page.locator('body')).toContainText('Playwright Motor X1');
    });
  });
});
