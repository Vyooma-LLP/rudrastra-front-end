import { test, expect, chromium } from '@playwright/test';

test.describe('Zero Trust Forensic Audit - Golden Path', () => {
  test('Execute full customer journey', async ({ page }) => {
    console.log('--- STARTING AUDIT ---');
    
    // 1. Landing
    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Rudrastra/i).catch(() => console.log('WARNING: Title missing or incorrect'));

    // 2. Login/Signup Check
    console.log('Looking for Auth Links...');
    // The previous static audit found the links in the Navbar.
    // However, it might be hidden behind 'sm:flex' on small screens. Playwright defaults to desktop usually.
    const loginLink = page.getByRole('link', { name: /Sign In/i }).first();
    if (await loginLink.isVisible()) {
      console.log('Sign In link is visible.');
      await loginLink.click();
    } else {
      console.log('ERROR: Sign In link NOT VISIBLE. Testing direct URL.');
      await page.goto('http://localhost:3000/login');
    }

    await page.waitForURL('**/login');
    console.log('On Login Page');

    // 3. Signup
    const createAccountLink = page.getByRole('link', { name: /Customer \/ Engineer/i });
    if (await createAccountLink.isVisible()) {
      await createAccountLink.click();
      console.log('Navigated to Signup');
    } else {
      console.log('ERROR: Customer signup link missing.');
      await page.goto('http://localhost:3000/signup?role=customer');
    }

    await page.waitForURL('**/signup*');
    console.log('On Signup Page');
    
    // Attempt signup
    await page.fill('input[type="text"]', 'Audit User');
    await page.fill('input[type="email"]', `audit-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    
    console.log('Submitting Signup form...');
    const signupBtn = page.getByRole('button', { name: /Create Account/i });
    await signupBtn.click();
    
    // Wait for network response or redirect
    await page.waitForTimeout(2000);
    console.log('Current URL after signup:', page.url());

    // 4. Products / Catalog
    console.log('Navigating to Products...');
    await page.goto('http://localhost:3000/products');
    await page.waitForTimeout(1000);
    
    // Look for product links
    const productLinks = await page.locator('a[href^="/products/"]').all();
    console.log(`Found ${productLinks.length} product links.`);
    
    if (productLinks.length > 0) {
      console.log('Clicking first product...');
      await productLinks[0].click();
      await page.waitForTimeout(2000);
      console.log('On PDP:', page.url());
      
      // 5. Add to Cart
      const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i });
      if (await addToCartBtn.isVisible()) {
        console.log('Adding to Cart...');
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
      } else {
        console.log('ERROR: Add to Cart button not found.');
      }
    } else {
      console.log('ERROR: No products found on listing page.');
    }

    // 6. Cart
    console.log('Navigating to Cart...');
    await page.goto('http://localhost:3000/cart');
    await page.waitForTimeout(1000);
    
    const requestQuoteBtn = page.getByRole('link', { name: /Request Quote/i });
    if (await requestQuoteBtn.isVisible()) {
      console.log('Request Quote link found. Clicking...');
      await requestQuoteBtn.click();
      await page.waitForTimeout(2000);
      console.log('On Quote Request Page:', page.url());
      
      // 7. Quote Submission
      const nameInput = page.locator('input').filter({ hasText: 'Full Name' });
      // If we can't find it easily by text, just grab the first few inputs
      const inputs = await page.locator('input').all();
      if (inputs.length >= 4) {
        await inputs[0].fill('Audit User');
        await inputs[1].fill('Audit Corp');
        await inputs[2].fill('audit@example.com');
        await inputs[3].fill('9999999999');
        await inputs[4].fill('123 Audit St, Audit City, ST, 12345');
        
        console.log('Submitting Quote Request...');
        const submitBtn = page.getByRole('button', { name: /Submit Quote Request/i });
        await submitBtn.click();
        await page.waitForTimeout(3000);
        console.log('After submit URL:', page.url());
      } else {
        console.log('ERROR: Quote form inputs not found.');
      }
    } else {
      console.log('ERROR: Request Quote button not found. Cart may be empty or UI is broken.');
    }

    console.log('--- AUDIT COMPLETE ---');
  });
});
