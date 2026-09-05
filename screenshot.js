const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/products/8cb2377f-32d2-4613-a959-52647806c6cf', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'storefront.png', fullPage: true });
  await browser.close();
})();
