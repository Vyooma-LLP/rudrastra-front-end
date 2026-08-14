const fs = require('fs');
let code = fs.readFileSync('tests/final-gate-1-customer.spec.ts', 'utf8');

code = code.replace(
  /const email = `gate1_\$\{crypto\.randomBytes\(4\)\.toString\('hex'\)\}@example\.com`;/,
  "page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));\n        const email = `gate1_${crypto.randomBytes(4).toString('hex')}@example.com`;"
);

fs.writeFileSync('tests/final-gate-1-customer.spec.ts', code);
