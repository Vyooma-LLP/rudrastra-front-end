import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:Rudrastra%401947@db.tqolbhkqxsccsxsvhxgh.supabase.co:5432/postgres';

async function inspectStorage() {
  const sql = postgres(dbUrl);

  console.log('--- BUCKETS ---');
  try {
    const buckets = await sql`SELECT id, name, public FROM storage.buckets`;
    console.table(buckets);
  } catch (err) {
    console.error('Error fetching buckets:', err.message);
  }

  console.log('\n--- STORAGE.OBJECTS POLICIES ---');
  try {
    const policies = await sql`
      SELECT polname, polcmd, polroles, polqual, polwithcheck 
      FROM pg_policy 
      WHERE polrelid = 'storage.objects'::regclass
    `;
    console.table(policies);
  } catch (err) {
    console.error('Error fetching policies:', err.message);
  }

  await sql.end();
}

inspectStorage();
