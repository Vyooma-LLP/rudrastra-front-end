import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';

test.describe('P0 - Auth Consistency', () => {
    test('Signup success, duplicate email, logout/login, invalid password', async ({ page, request }) => {
        const userEmail = `auth_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const userPassword = 'TestPassword123!';
        
        // A. signup success
        const signupRes = await request.post(`${baseUrl}/api/auth/signup`, {
            data: {
                email: userEmail,
                password: userPassword,
                fullName: 'Normal User',
                companyName: 'Normal Inc'
            }
        });
        expect(signupRes.status()).toBe(201);

        // C. duplicate email
        const dupRes = await request.post(`${baseUrl}/api/auth/signup`, {
            data: {
                email: userEmail,
                password: 'DifferentPassword123!',
                fullName: 'Normal User 2',
                companyName: 'Normal Inc 2'
            }
        });
        expect(dupRes.status()).not.toBe(201); // should fail cleanly

        // G. logout/login
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', userEmail);
        await page.fill('input[type="password"]', userPassword);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*(localhost:3000\/?$|account).*/, { timeout: 10000 });
        
        await request.post(`${baseUrl}/api/auth/logout`);

        // I. invalid password
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', userEmail);
        await page.fill('input[type="password"]', 'WrongPassword123!');
        await page.click('button[type="submit"]');
        await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 5000 });
    });
});
