import fs from 'fs';
import path from 'path';

function walk(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = walk(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = walk('src/app');
const pages = allFiles.filter(f => f.endsWith('page.tsx'));
const apis = allFiles.filter(f => f.endsWith('route.ts'));

console.log(`Pages: ${pages.length}`);
console.log(`APIs: ${apis.length}`);
