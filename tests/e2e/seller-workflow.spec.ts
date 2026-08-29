import { test, expect } from '@playwright/test';

test.describe('Seller Lifecycle Workflow', () => {
  test('Complete Offer to Inventory pipeline', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // PHASE 5: Seller Zero-Trust Workflow
    
    // 1. Seller Offer Creation
    await test.step('Create Seller Offer', async () => {
      await page.goto('/seller/offers/new');
      await page.waitForLoadState('networkidle');
      
      // Select canonical variant (expecting at least one to exist from ops test or seeded)
      await page.locator('select').selectOption({ index: 1 });
      
      await page.locator('input[placeholder="e.g. SKU-12345"]').fill('TEST-SELLER-SKU-1');
      await page.locator('input[placeholder="0.00"]').fill('1500'); // Price
      
      // Default MOQ is 1, Lead time is 0. Let's change them to test.
      await page.locator('input[type="number"]').nth(1).fill('10'); // MOQ
      await page.locator('input[type="number"]').nth(2).fill('3'); // Lead Time
      
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: /Save Offer Mapping/i }).click()
      ]);
      
      await expect(page.url()).toContain('/seller/offers');
      await expect(page.locator('td:has-text("TEST-SELLER-SKU-1")').first()).toBeVisible();
    });

    // PHASE 6: Inventory Workflow
    await test.step('Add Inventory Stock', async () => {
      await page.goto('/seller/inventory/new');
      await page.waitForLoadState('networkidle');
      
      // Select SKU we just created
      await page.locator('select').nth(0).selectOption({ label: 'TEST-SELLER-SKU-1' });
      
      // Enter stock quantity
      await page.locator('input[type="number"]').fill('100');
      
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: /Record Inventory/i }).click()
      ]);
      
      await expect(page.url()).toContain('/seller/inventory');
      
      // Verify persistence
      await expect(page.locator('td:has-text("100")').first()).toBeVisible();
      await page.reload();
      await expect(page.locator('td:has-text("100")').first()).toBeVisible();
    });
  });
});
