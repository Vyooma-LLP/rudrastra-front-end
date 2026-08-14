import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import { execSync } from 'child_process';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Gate 2: Admin/Ops Authorization', () => {
    test.setTimeout(90000); // 90 seconds

    test('Verify Customer is denied, then Admin is allowed and can transition state', async ({ browser, playwright }) => {
        const email = `gate2_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const password = 'Password123!';

        // Use isolated context for customer
        let context = await browser.newContext();
        let page = await context.newPage();

        // 1. Signup Customer
        await page.goto(`${baseUrl}/signup`);
        await page.fill('input[name="fullName"]', 'Gate 2 Admin Test');
        await page.fill('input[name="companyName"]', 'Gate2 Inc');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*(\/account|\/login\?registered=true).*/, { timeout: 10000 });
        if (page.url().includes('login')) {
            await page.fill('input[type="email"]', email);
            await page.fill('input[type="password"]', password);
            await page.click('button[type="submit"]');
            await page.waitForURL(/.*\/account.*/);
        }
        console.log('[EVIDENCE] Signup and Initial Login successful');

        // Customer API access
        const storageState = await context.storageState();
        const apiContext = await playwright.request.newContext({ baseURL: baseUrl, storageState });
        const res = await apiContext.get(`/api/admin/quotes`);
        expect(res.status()).toBe(401);
        console.log('[EVIDENCE] Customer API access to /api/admin/quotes returned 401');

        // Verify Customer access to UI /ops is denied
        await page.goto(`${baseUrl}/ops`);
        await page.waitForTimeout(2000);
        const bodyText = await page.innerText('body');
        const isRedirected = !page.url().includes('/ops');
        const isUnauthorized = bodyText.toLowerCase().includes('unauthorized') || bodyText.toLowerCase().includes('404');
        expect(isRedirected || isUnauthorized).toBeTruthy();
        console.log('[EVIDENCE] Customer UI access to /ops was blocked/redirected');

        // Close customer context
        await context.close();
        console.log('[EVIDENCE] Customer logged out');

        // 2. Promote to Admin via shell script
        console.log(`[EVIDENCE] Elevating user ${email} to ADMIN in database`);
        execSync(`npx tsx -e "import { db } from './src/db'; import { users } from './src/db/schema'; import { eq } from 'drizzle-orm'; async function run() { await db.update(users).set({ role: 'ADMIN' }).where(eq(users.email, '${email}')); process.exit(0); } run();"`, { env: { ...process.env, NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY } });
        console.log('[EVIDENCE] User promoted to ADMIN successfully');

        // 3. Login as Admin
        context = await browser.newContext();
        page = await context.newPage();
        
        await page.goto(`${baseUrl}/login`);
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*\/account.*/);
        console.log('[EVIDENCE] Admin Login successful');

        // 4. Access Admin Dashboard
        await page.goto(`${baseUrl}/ops/quotes`);
        await page.waitForURL('**/ops/quotes**');
        console.log('[EVIDENCE] Admin UI access to /ops/quotes successful');

        const adminStorageState = await context.storageState();
        const adminApiContext = await playwright.request.newContext({ baseURL: baseUrl, storageState: adminStorageState });
        const adminRes = await adminApiContext.get(`/api/admin/quotes`);
        expect(adminRes.status()).toBe(200);
        console.log('[EVIDENCE] Admin API access to /api/admin/quotes returned 200');

        // Let's create a quote first for this user via API
        await adminApiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId: '13a9a9e3-8d22-46be-ac7e-0e126621695a', quantity: 1 } }
        });
        await adminApiContext.post('/api/quotes', {
            data: {
                idempotencyKey: crypto.randomBytes(16).toString('hex'),
                customerInfo: { name: 'Admin', email: email, phone: '9876543210' },
                shippingAddress: { line1: '123 Admin St', city: 'City', state: 'State', pincode: '123' }
            }
        });
        
        // Go back to admin
        await page.goto(`${baseUrl}/ops/quotes`);
        await page.click('a:has-text("Review")'); // Click first quote
        
        console.log('[EVIDENCE] Admin opened quote detail page');
        
        // Change state
        await page.selectOption('select', 'REVIEWING');
        
        // Click save and expect toast
        await page.click('button:has-text("Save")');
        await expect(page.getByText('Status updated successfully')).toBeVisible();
        await page.waitForTimeout(1000);
        
        // Refresh page to verify persistence
        await page.reload();
        await page.waitForSelector('select');
        const selectedValue = await page.$eval('select', el => (el as HTMLSelectElement).value);
        expect(selectedValue).toBe('REVIEWING');
        console.log('[EVIDENCE] Status transition persisted successfully');
        
        await context.close();
    });
});
