import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:Rudrastra%401947@db.tqolbhkqxsccsxsvhxgh.supabase.co:5432/postgres');
async function main() {
    try {
        const res = await sql`
            SELECT tgname, relname, proname 
            FROM pg_trigger 
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
            JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid 
            WHERE pg_class.relname = 'users' AND pg_class.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth');
        `;
        console.log("Triggers on auth.users:", res);
        
        const res2 = await sql`SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'handle_new_user';`;
        console.log("handle_new_user function:", res2);
    } catch(e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
main();
