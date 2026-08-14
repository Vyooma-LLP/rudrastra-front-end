import { sql } from 'drizzle-orm';
import { db } from '../src/db/index';
import * as fs from 'fs';

async function main() {
    const file = process.argv[2];
    if (!file) throw new Error("Provide SQL file");
    const query = fs.readFileSync(file, 'utf8');
    const statements = query.split('--> statement-breakpoint');
    for (const stmt of statements) {
        if (stmt.trim()) {
            console.log('Running:', stmt.trim());
            await db.execute(sql.raw(stmt.trim()));
        }
    }
    console.log('Migration completed successfully!');
    process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
