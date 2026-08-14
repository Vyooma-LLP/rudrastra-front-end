import { test, expect } from '@playwright/test';
import crypto from 'crypto';

test.describe.configure({ mode: 'serial' });

const baseUrl = 'http://localhost:3000';
const userEmail = `test_${crypto.randomBytes(4).toString('hex')}@example.com`;
const userPassword = 'TestPassword123!';

test.describe('MVP Golden Path Audit', () => {

  test('01. Unauthenticated Security Boundaries', async ({ page }) => {
    // Attempt to access protected routes
    await page.goto(`${baseUrl}/account`);
    await expect(page).toHaveURL(/.*\/login.*/);
    
    // Attempt SQL injection via API
    const res = await page.request.get(`${baseUrl}/api/products/1234' OR 1=1--`);
    expect(res.status()).toBe(400); 
  });

  test('02. Customer Golden Path: Auth, Catalog, Cart, Quote', async ({ page }) => {
    // --- SIGNUP ---
    await page.goto(baseUrl);
    
    const createAccount = page.getByRole('link', { name: /Create Account/i }).first();
    await expect(createAccount).toBeVisible();
    await createAccount.click();
    
    await page.waitForURL(/.*\/signup.*/);
    
    // Ensure form fields are available
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    await page.fill('input[name="fullName"]', 'Audit User');
    await page.fill('input[name="companyName"]', 'Audit Corp');
    await page.locator('input[type="email"]').fill(userEmail);
    await page.locator('input[type="password"]').fill(userPassword);
    
    // Attempt submit
    await page.click('button[type="submit"]');
    
    // Should go to login
    await page.waitForURL(/.*\/login\?registered=true.*/, { timeout: 10000 });
    
    // --- LOGIN ---
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    
    // It should redirect to home page or account
    await page.waitForURL(/.*(localhost:3000\/?$|account).*/, { timeout: 10000 });

    // --- CATALOG & CART ---
    await page.goto(`${baseUrl}/products`);
    
    // Wait for products to load
    await page.waitForSelector('.grid');
    
    // Click the first product
    const firstProductLink = page.locator('a[href^="/products/"]').first();
    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();
    
    // On product detail page
    await page.waitForURL(/.*\/products\/.+/);
    
    // Add to cart
    const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartBtn).toBeVisible();
    
    await addToCartBtn.click();
    await expect(page.getByText('Added to cart successfully!')).toBeVisible();
    
    // --- REQUEST QUOTE ---
    await page.goto(`${baseUrl}/cart`);
    await expect(page.getByText(/Engineering Procurement Cart/i)).toBeVisible();
    
    const requestQuoteBtn = page.locator('main').getByRole('link', { name: /Request Quote/i });
    await expect(requestQuoteBtn).toBeVisible();
    await requestQuoteBtn.click();
    
    // Quote Request Form
    await page.waitForURL(/.*\/quote-request.*/);
    
    // We already have fullName and email pre-filled from context, so we just submit or add notes
    await page.locator('#quote-company').fill('Audit Corp');
    await page.locator('#quote-phone').fill('9876543210');
    await page.locator('#quote-address').fill('123 Test Street');
    await page.locator('#quote-notes').fill('Testing MVP integration');
    
    await page.getByRole('button', { name: /Submit Quote Request/i }).click();
    
    // Should redirect to Account page
    await page.waitForURL(/.*\/quote-request\/success.*/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Quote Request Received/i })).toBeVisible();
  });
});
