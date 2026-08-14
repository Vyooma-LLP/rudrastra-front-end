const fs = require('fs');
let code = fs.readFileSync('tests/final-gate-1-customer.spec.ts', 'utf8');

code = code.replace(/input\[name="company"\]/g, "input#quote-company");
code = code.replace(/await page\.fill\('input\[name="phone"\]', '9876543210'\);/g, "await page.fill('input#quote-phone', '9876543210');");
code = code.replace(/await page\.fill\('input\[name="addressLine1"\]', '456 Alternate St'\);/g, "await page.fill('input#quote-address', '456 Alternate St');");
code = code.replace(/await page\.click\('button\[type="submit"\]'\);\s*\/\/ 8\. Success receipt/g, "await page.getByRole('button', { name: /Submit Quote Request/i }).click();\n\n        // 8. Success receipt");

fs.writeFileSync('tests/final-gate-1-customer.spec.ts', code);
