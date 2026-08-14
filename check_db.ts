import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres.xurmlezgwfyxkrwhakxf:!Varanasi@1947@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require');

async function main() {
    try {
        const constraints = await sql`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'users';
        `;
        console.log("Constraints:", constraints);
        
        const enums = await sql`
            SELECT t.typname, e.enumlabel
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace;
        `;
        console.log("Enums:", enums);
    } catch(e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
main();
