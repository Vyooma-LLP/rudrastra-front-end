import { test, expect } from '@playwright/test';

test.describe('Customer Commerce Workflow', () => {
  test('Complete Cart to Quote pipeline', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // PHASE 4: Customer Commerce Workflow
    
    // 1. Customer Discovery & Cart
    await test.step('Browse Catalog and Add to Cart', async () => {
      // Go to products page
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Click first product card
      await page.locator('a[href^="/products/"]').first().click();
      await page.waitForLoadState('networkidle');
      
      // Select variant if there are buttons
      const variantButtons = page.locator('button', { hasText: /Variant|Standard|KV|Pro/i });
      if (await variantButtons.count() > 0) {
        await variantButtons.first().click();
      }
      
      // Add to Cart from the first offer
      const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
      await expect(addToCartBtn).not.toBeDisabled();
      await addToCartBtn.click();
      
      // Wait for toast or local state to update
      await page.waitForTimeout(1000); 
    });

    // 2. Request Quote Workflow
    await test.step('Request Quote from Cart', async () => {
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');
      
      // Verify item exists in cart
      await expect(page.locator('h3').first()).toBeVisible();
      
      // Proceed to Quote
      await page.getByRole('button', { name: /Proceed to Quote/i }).click();
      await page.waitForLoadState('networkidle');
      
      // Fill Quote Form
      await page.fill('input[name="company"]', 'Playwright Industries');
      await page.fill('textarea[name="projectDescription"]', 'E2E Validation Build');
      await page.fill('input[name="timeline"]', '2 Weeks');
      
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: /Submit Quote Request/i }).click()
      ]);
      
      // Expect success redirect
      await expect(page.url()).toContain('/quote-request/success');
    });

    // 3. Quote History
    await test.step('Verify Quote History', async () => {
      await page.goto('/account/quotes');
      await page.waitForLoadState('networkidle');
      
      // Quote should be listed
      await expect(page.locator('td:has-text("Playwright Industries")').first()).toBeVisible();
    });
  });
});
