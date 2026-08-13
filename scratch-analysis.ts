import fs from 'fs';
import path from 'path';

function walk(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
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

const adapters = walk('src/modules').filter(f => f.includes('Adapter.ts'));
console.log("Adapters:", adapters);

const schemaFile = fs.readFileSync('src/db/schema.ts', 'utf-8');
const tables = [...schemaFile.matchAll(/export const ([a-zA-Z0-9_]+) = pgTable/g)].map(m => m[1]);
console.log("Tables:", tables);

