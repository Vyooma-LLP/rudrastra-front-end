import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';

test.describe('P0 - Admin Boundary', () => {
    test('Admin API endpoints are protected', async ({ request, page }) => {
        const userEmail = `auth_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const userPassword = 'TestPassword123!';
        
        // 1. Create a customer
        await request.post(`${baseUrl}/api/auth/signup`, {
            data: { email: userEmail, password: userPassword, fullName: 'Customer', companyName: 'Customer Inc' }
        });

        // 2. Login as customer
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', userEmail);
        await page.fill('input[type="password"]', userPassword);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*\/account.*/, { timeout: 10000 });

        // 3. Test API bounds
        const resQuotes = await request.get(`${baseUrl}/api/admin/quotes`);
        expect(resQuotes.status()).toBe(401);

        const resQuoteId = await request.get(`${baseUrl}/api/admin/quotes/123`);
        expect(resQuoteId.status()).toBe(401);

        const resPatch = await request.patch(`${baseUrl}/api/admin/quotes/123`);
        expect([401, 405]).toContain(resPatch.status());

        const resDelete = await request.delete(`${baseUrl}/api/admin/quotes/123`);
        expect([401, 405]).toContain(resDelete.status());
    });
});
