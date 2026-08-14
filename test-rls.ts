import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function checkRLS() {
    const res = await db.execute(sql`SELECT tablename, policyname, roles, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('users', 'quotes', 'quote_items', 'orders');`);
    console.table(res);
    process.exit(0);
}
checkRLS().catch(console.error);
