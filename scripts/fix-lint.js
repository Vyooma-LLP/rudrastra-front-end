const fs = require('fs');
const files = [
  'src/app/api/cart/route.ts',
  'src/app/api/checkout/route.ts',
  'src/app/api/orders/route.ts',
  'src/app/api/admin/products/route.ts',
  'src/app/api/admin/products/[id]/route.ts'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
  content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  content = content.replace(/err\.message/g, '(err as Error).message');
  content = content.replace(/error\.message/g, '(error as Error).message');
  content = content.replace(/error\.code/g, '(error as any).code');
  fs.writeFileSync(file, content);
}
console.log('Lint fixes applied');
