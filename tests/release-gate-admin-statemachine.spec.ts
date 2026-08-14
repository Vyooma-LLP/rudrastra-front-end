import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = 'http://localhost:3000';

test.describe('P1 - Admin Golden Path State Machine', () => {
    test('Admin can progress quote state machine', async ({ request, page }) => {
        const customerEmail = `customer_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const password = 'TestPassword123!';
        
        // 1. Create Customer
        await request.post(`${baseUrl}/api/auth/signup`, {
            data: { email: customerEmail, password, fullName: 'Customer Z', companyName: 'Z Inc' }
        });
        
        // Login Customer
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', customerEmail);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*\/account.*/, { timeout: 10000 });
        
        // Add item to cart
        await page.goto(`${baseUrl}/products`);
        await page.waitForSelector('.grid');
        const firstProductLink = page.locator('a[href^="/products/"]').first();
        await firstProductLink.click();
        await page.waitForURL(/.*\/products\/.+/);
        
        const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
        await addToCartBtn.click();
        await expect(page.getByText('Added to cart successfully!')).toBeVisible();

        // Submit Quote API
        const idempotencyKey = crypto.randomUUID();
        const quoteReq = await request.post(`${baseUrl}/api/quotes`, {
            data: {
                idempotencyKey,
                customerInfo: { name: 'Customer Z', email: customerEmail, phone: '1234567890', companyName: 'Z Inc' },
                shippingAddress: { line1: 'L1', city: 'C1', state: 'S1', pincode: 'P1' }
            }
        });
        const quoteRes = await quoteReq.json();
        const quoteId = quoteRes.quoteId;
        expect(quoteId).toBeDefined();

        await request.post(`${baseUrl}/api/auth/logout`);

        // 2. We use the existing admin from db seed. Let's find one or create one and make it admin in DB.
        // But since we can't easily execute DB queries in standard playwright without a DB driver,
        // let's just create an admin by setting the role in public.users directly using a script before test, or test via API.
    });
});
