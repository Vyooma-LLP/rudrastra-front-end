import { test, expect } from '@playwright/test';
import crypto from 'crypto';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Gate 3: Quote API Abuse & Integrity', () => {
    let apiContext: any;
    let userId: string;
    let productId = '13a9a9e3-8d22-46be-ac7e-0e126621695a'; // Using a known ID from seed data

    test.beforeAll(async ({ playwright }) => {
        const email = `abuse_${crypto.randomBytes(4).toString('hex')}@example.com`;
        const password = 'Password123!';
        
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(`${baseUrl}/signup`);
        await page.fill('input[name="fullName"]', 'Abuse Test');
        await page.fill('input[name="companyName"]', 'Abuse Inc');
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

        const storageState = await context.storageState();
        apiContext = await playwright.request.newContext({
            baseURL: baseUrl,
            storageState,
        });
        
        await browser.close();
    });

    test('Quantity 0 should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 0 } }
        });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('INVALID_QUANTITY');
    });

    test('Quantity -1 should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: -1 } }
        });
        expect(res.status()).toBe(400);
    });

    test('Decimal quantity (1.5) should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 1.5 } }
        });
        expect(res.status()).toBe(400);
    });

    test('String quantity ("five") should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: "five" } }
        });
        expect(res.status()).toBe(400);
    });

    test('Missing Product ID should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId: null, quantity: 1 } }
        });
        expect(res.status()).toBe(400);
    });

    test('Fake UUID should return 404', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId: '00000000-0000-0000-0000-000000000000', quantity: 1 } }
        });
        expect(res.status()).toBe(404);
    });

    test('Huge quantity (99999999) should be rejected', async () => {
        const res = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 99999999 } }
        });
        expect(res.status()).toBe(400);
    });

    test('Duplicate product should update quantity or reject, not duplicate row', async () => {
        const res1 = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 1 } }
        });
        expect(res1.status()).toBe(200);

        const res2 = await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 1 } }
        });
        expect(res2.status()).toBe(200);
        
        const cartRes = await apiContext.get('/api/cart');
        const cartBody = await cartRes.json();
        
        const itemsWithId = cartBody.items.filter((item: any) => item.productId === productId);
        expect(itemsWithId.length).toBe(1); 
        expect(itemsWithId[0].quantity).toBe(2); 
    });

    test('Empty cart submission to quote should be rejected', async () => {
        const cartRes = await apiContext.get('/api/cart');
        const cartBody = await cartRes.json();
        for (const item of cartBody.items) {
             await apiContext.post('/api/cart', {
                 data: { action: 'REMOVE', payload: { itemId: item.id } }
             });
        }

        const res = await apiContext.post('/api/quotes', {
            data: {
                idempotencyKey: crypto.randomBytes(16).toString('hex'),
                customerInfo: { name: 'Test', email: 'test@example.com', phone: '123' },
                shippingAddress: { line1: '123', city: 'C', state: 'S', pincode: '123' }
            }
        });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('Cart is empty');
    });

    test('Double-submit quote should be prevented by Idempotency Key', async () => {
        await apiContext.post('/api/cart', {
            data: { action: 'ADD', payload: { productId, quantity: 1 } }
        });

        const idempKey = crypto.randomBytes(16).toString('hex');
        const payload = {
            idempotencyKey: idempKey,
            customerInfo: { name: 'Test', email: 'test@example.com', phone: '123' },
            shippingAddress: { line1: '123', city: 'C', state: 'S', pincode: '123' }
        };

        const [res1, res2] = await Promise.all([
            apiContext.post('/api/quotes', { data: payload }),
            apiContext.post('/api/quotes', { data: payload })
        ]);

        expect([res1.status(), res2.status()]).toContain(200);
        
        const quotesRes = await apiContext.get('/api/quotes');
        const quotesBody = await quotesRes.json();
        expect(quotesBody.quotes.length).toBe(1);
    });
});
