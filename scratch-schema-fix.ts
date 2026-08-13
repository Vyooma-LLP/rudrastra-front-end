import fs from 'fs';

let content = fs.readFileSync('src/db/schema.ts', 'utf-8');

// Replace dynamic imports with static ones in imports if necessary, 
// but wait, Drizzle imports check and jsonb natively.
// Let's just fix the top imports:
if (!content.includes('jsonb')) {
  content = content.replace(
      'import { pgTable, uuid, text, timestamp, integer, boolean, unique } from "drizzle-orm/pg-core";',
      'import { pgTable, uuid, text, timestamp, integer, boolean, unique, jsonb, check } from "drizzle-orm/pg-core";\nimport { sql } from "drizzle-orm";'
  );
}

content = content.replace(/import\("drizzle-orm\/pg-core"\)\.jsonb/g, 'jsonb');
content = content.replace(/import\("drizzle-orm\/pg-core"\)\.check/g, 'check');
content = content.replace(/import\("drizzle-orm"\)\.sql/g, 'sql');

fs.writeFileSync('src/db/schema.ts', content);
