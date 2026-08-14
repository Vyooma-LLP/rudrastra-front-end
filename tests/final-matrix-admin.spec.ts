import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';
const userEmail = `matrix_${crypto.randomBytes(4).toString('hex')}@example.com`;
const userPassword = 'TestPassword123!';

test('04. Admin Security Boundary Matrix', async ({ page, request, context, browser }) => {
    // Signup first
    await page.goto(`${baseUrl}/signup`);
    await page.fill('input[name="fullName"]', 'Matrix User');
    await page.fill('input[name="companyName"]', 'Matrix Corp');
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/login.*/, { timeout: 10000 });

    // Login as customer
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/account.*/, { timeout: 10000 });

    // Customer -> /ops denied (should 403 Forbidden since layout throws forbidden())
    await page.goto(`${baseUrl}/ops`);
    // Verify Next.js Not Found page is displayed
    await expect(page.getByText('404')).toBeVisible();

    // Customer API access denied
    const apiRes = await request.get(`${baseUrl}/api/admin/quotes`);
    expect(apiRes.status()).toBe(401);

    // Close customer context to log out
    await context.close();
    
    // Open new unauthenticated context
    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();

    // Unauthenticated -> /ops denied (redirects to login)
    await freshPage.goto(`${baseUrl}/ops`);
    await freshPage.waitForURL(/.*\/login.*/, { timeout: 5000 });
});
