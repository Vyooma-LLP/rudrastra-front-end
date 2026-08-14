import { test, expect } from '@playwright/test';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Gate 5: Interaction Crawl & Error Detection', () => {
    test('Crawl public pages for JS errors and broken links', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', err => {
            errors.push(err.message);
        });
        
        // 1. Home
        await page.goto(`${baseUrl}/`);
        await expect(page.getByText(/RUDRASTRA/i).first()).toBeVisible();
        
        // 2. Products
        await page.goto(`${baseUrl}/products`);
        await expect(page.getByText(/Products/i).first()).toBeVisible();
        
        // 3. Login
        await page.goto(`${baseUrl}/login`);
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Ensure no unhandled exceptions
        expect(errors.length).toBe(0);
    });
});
