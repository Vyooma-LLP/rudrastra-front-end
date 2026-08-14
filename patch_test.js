const fs = require('fs');
let code = fs.readFileSync('tests/final-gate-1-customer.spec.ts', 'utf8');

// Fix profile phone number
code = code.replace(
    /await page\.fill\('input\[name="addressLine1"\]', '123 Test St'\);/,
    "await page.fill('input[name=\"phone\"]', '9876543210');\n        await page.fill('input[name=\"addressLine1\"]', '123 Test St');"
);

// Fix request quote link
code = code.replace(
    /await page\.getByRole\('button', \{ name: \/Request Quote\/i \}\)\.click\(\);/,
    "await page.getByRole('link', { name: /Request Quote/i }).click();"
);

fs.writeFileSync('tests/final-gate-1-customer.spec.ts', code);
