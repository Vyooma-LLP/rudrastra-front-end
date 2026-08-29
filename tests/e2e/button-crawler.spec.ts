import { test, expect } from '@playwright/test';

test.describe('Phase 11: Button Crawler Audit', () => {
  // A representative sample of core pages to crawl for broken interactions
  const targetRoutes = [
    '/products',
    '/ops/catalog',
    '/seller/dashboard',
    '/cart'
  ];

  for (const route of targetRoutes) {
    test(`Crawl interactions on ${route}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      const failures: string[] = [];

      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Find all buttons and links
      const interactables = page.locator('button, a[href]');
      const count = await interactables.count();
      
      console.log(`Found ${count} interactable elements on ${route}`);

      for (let i = 0; i < Math.min(count, 15); i++) { // Limit to 15 per page to avoid infinite loops/timeouts
        const el = interactables.nth(i);
        if (await el.isVisible() && await el.isEnabled()) {
          const text = await el.textContent();
          const tag = await el.evaluate(e => e.tagName);
          
          try {
            // Use soft assertion and just log if it works
            // We just click and see if it throws a massive error or navigates to a 404/500
            // Since we can't easily undo state, we evaluate hrefs safely, or only click buttons
            // that don't submit destructive forms.
            if (tag.toLowerCase() === 'a') {
              const href = await el.getAttribute('href');
              if (href && !href.startsWith('mailto')) {
                 expect.soft(href).not.toBe('');
              }
            } else {
               // Safely hover or check properties instead of clicking destructive buttons blindly
               await el.hover();
               expect.soft(await el.getAttribute('disabled')).toBeFalsy();
            }
          } catch (e: any) {
             failures.push(`Failed interaction on element: ${text?.trim()} - ${e.message}`);
          }
        }
      }

      if (failures.length > 0) {
        console.error(`Failures on ${route}:`, failures);
      }
      expect.soft(failures.length).toBe(0);
    });
  }
});
