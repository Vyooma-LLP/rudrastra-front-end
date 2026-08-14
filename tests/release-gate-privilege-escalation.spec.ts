import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';

test('P0 - Privilege Escalation via Signup Metadata', async ({ request, page }) => {
    const userEmail = `hacker_${crypto.randomBytes(4).toString('hex')}@example.com`;
    const userPassword = 'TestPassword123!';
    
    // Attempt signup via API with role=ADMIN
    const res = await request.post(`${baseUrl}/api/auth/signup`, {
        data: {
            email: userEmail,
            password: userPassword,
            fullName: 'Hacker',
            companyName: 'Hacker Inc',
            role: 'ADMIN' // Malicious injection
        }
    });
    expect(res.status()).toBe(201);

    // Login
    await page.goto(`${baseUrl}/login`);
    await page.fill('input[type="email"]', userEmail);
    await page.fill('input[type="password"]', userPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/account.*/, { timeout: 10000 });

    // Attempt /ops
    await page.goto(`${baseUrl}/ops`);
    await expect(page.getByText('404')).toBeVisible();

    // Attempt /api/admin/quotes
    const apiRes = await request.get(`${baseUrl}/api/admin/quotes`);
    expect(apiRes.status()).toBe(401);
});
