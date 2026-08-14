import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres.xurmlezgwfyxkrwhakxf:!Varanasi@1947@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require');

async function main() {
    try {
        const users = await sql`
            SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
        `;
        console.log("Recent Auth Users:", users);
    } catch(e) {
        console.error('Failed:', e);
    } finally {
        await sql.end();
    }
}
main();
