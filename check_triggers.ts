import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres.xurmlezgwfyxkrwhakxf:!Varanasi@1947@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require');

async function main() {
    try {
        const triggers = await sql`
            SELECT event_object_schema, event_object_table, trigger_name, action_statement
            FROM information_schema.triggers
            WHERE event_object_schema = 'auth' AND event_object_table = 'users';
        `;
        console.log("Auth Users Triggers:", triggers);
    } catch(e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
main();
