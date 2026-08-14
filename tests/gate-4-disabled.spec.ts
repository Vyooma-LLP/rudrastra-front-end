import { test, expect } from '@playwright/test';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Gate 4: Disabled Features MVP', () => {
    test('Direct checkout API should not exist or be disabled', async ({ request }) => {
        const res = await request.post(`${baseUrl}/api/checkout`);
        expect(res.status()).toBe(401);
    });

    test('Payment intents API should not exist', async ({ request }) => {
        const res = await request.post(`${baseUrl}/api/payments`);
        expect([401, 404, 405]).toContain(res.status());
    });

    test('UI should not have Buy Now button', async ({ page }) => {
        await page.goto(`${baseUrl}/products`);
        const firstProduct = page.locator('a[href^="/products/"]').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();
        await page.waitForSelector('text=Add to Cart');
        const buyNowVisible = await page.isVisible('text=Buy Now');
        expect(buyNowVisible).toBeFalsy();
    });
});
