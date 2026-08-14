const fs = require('fs');
let code = fs.readFileSync('tests/final-gate-1-customer.spec.ts', 'utf8');

// The last button[type="submit"] was in Quote, let's just make it click the Submit Quote Request button
code = code.replace(
    /await page\.fill\('input#quote-address', '456 Alternate St'\); \/\/ Edit address\n        await page\.click\('button\[type="submit"\]'\);/g,
    "await page.fill('input#quote-address', '456 Alternate St'); // Edit address\n        await page.getByRole('button', { name: /Submit Quote/i }).click();"
);

// I might have ruined the previous button[type="submit"] clicks. Let's fix them back if needed.
code = code.replace(/await page\.getByRole\('button', \{ name: \/Submit\/i \}\)\.click\(\);/g, "await page.click('button[type=\"submit\"]');");

fs.writeFileSync('tests/final-gate-1-customer.spec.ts', code);
