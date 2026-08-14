import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';

test.describe('P0 - IDOR Checks', () => {
    test('User A cannot access User B quotes', async ({ page, context, browser, playwright }) => {
        const userAEmail = `usera_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const userBEmail = `userb_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const password = 'TestPassword123!';
        
        // 1. Create User A and B
        await page.request.post(`${baseUrl}/api/auth/signup`, {
            data: { email: userAEmail, password, fullName: 'User A', companyName: 'A Inc' }
        });
        await page.request.post(`${baseUrl}/api/auth/signup`, {
            data: { email: userBEmail, password, fullName: 'User B', companyName: 'B Inc' }
        });

        // 2. Login as User A to get their session cookie
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', userAEmail);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*\/account.*/, { timeout: 10000 });

        // 3. User A creates a quote
        await page.goto(`${baseUrl}/products`);
        await page.waitForSelector('.grid');
        const firstProductLink = page.locator('a[href^="/products/"]').first();
        await firstProductLink.click();
        await page.waitForURL(/.*\/products\/.+/);
        
        // Add to cart
        const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
        await addToCartBtn.click();
        await expect(page.getByText('Added to cart successfully!')).toBeVisible();

        // Request quote
        await page.goto(`${baseUrl}/quote-request`);
        await page.fill('#quote-company', 'A Inc');
        await page.fill('#quote-phone', '1234567890');
        await page.fill('#quote-address', 'A Address');
        await page.fill('#quote-notes', 'A Notes');
        await page.click('button:has-text("Submit Quote Request")');
        await page.waitForURL(/.*\/quote-request\/success.*/, { timeout: 10000 });
        
        // Get the quote ID from URL search params
        const quoteId = new URL(page.url()).searchParams.get('quoteId');
        expect(quoteId).toBeTruthy();
        
        // Close User A context
        await context.close();

        // 4. Login as User B in a new fresh context
        const contextB = await browser.newContext();
        const pageB = await contextB.newPage();
        
        await pageB.goto(`${baseUrl}/login`);
        await pageB.fill('input[type="email"]', userBEmail);
        await pageB.fill('input[type="password"]', password);
        await pageB.click('button[type="submit"]');
        await pageB.waitForURL(/.*\/account.*/, { timeout: 10000 });

        // Get storage state for User B to run authenticated API requests
        const storageStateB = await contextB.storageState();
        const apiContextB = await playwright.request.newContext({ baseURL: baseUrl, storageState: storageStateB });

        // 5. Try to access User A's quote via API as User B
        const resBQuote = await apiContextB.get(`/api/quotes/${quoteId}`);
        expect(resBQuote.status()).toBe(404); // Should be 404 because of RLS/where clause
        
        // Also check if User A's quote is listed in User B's quotes list
        const resBQuotes = await apiContextB.get(`/api/quotes`);
        const bQuotes = await resBQuotes.json();
        expect(bQuotes.quotes.length).toBe(0);
        
        await contextB.close();
    });
});
