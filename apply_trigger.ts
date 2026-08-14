import postgres from 'postgres';
import fs from 'fs';

const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres.xurmlezgwfyxkrwhakxf:!Varanasi@1947@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require');

async function main() {
    try {
        const query = fs.readFileSync('drizzle/0007_auth_trigger.sql', 'utf8');
        await sql.unsafe(query);
        console.log('Trigger applied successfully.');
    } catch(e) {
        console.error('Failed:', e);
    } finally {
        await sql.end();
    }
}
main();
