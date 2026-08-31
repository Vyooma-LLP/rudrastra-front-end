import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:Rudrastra%401947@db.tqolbhkqxsccsxsvhxgh.supabase.co:5432/postgres';

async function setupStorage() {
  const sql = postgres(dbUrl);

  try {
    console.log('Creating product-media bucket...');
    // Create bucket if it doesn't exist
    await sql`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('product-media', 'product-media', true)
      ON CONFLICT (id) DO NOTHING;
    `;
    console.log('Bucket created or already exists.');

    console.log('Dropping existing policies on storage.objects for product-media just in case...');
    await sql`
      DROP POLICY IF EXISTS "Public access to product-media" ON storage.objects;
    `;
    await sql`
      DROP POLICY IF EXISTS "Admin upload to product-media" ON storage.objects;
    `;
    await sql`
      DROP POLICY IF EXISTS "Admin update to product-media" ON storage.objects;
    `;
    await sql`
      DROP POLICY IF EXISTS "Admin delete from product-media" ON storage.objects;
    `;

    console.log('Creating policies...');
    // 1. Public Read Access
    await sql`
      CREATE POLICY "Public access to product-media"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'product-media' );
    `;

    // 2. Admin Write Access (INSERT, UPDATE, DELETE)
    // The policy checks if the authenticated user's email exists in the public.users table with role = 'ADMIN'
    const adminCheck = `
      EXISTS (
        SELECT 1 FROM public.users
        WHERE users.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND users.role = 'ADMIN'
      )
    `;

    await sql`
      CREATE POLICY "Admin upload to product-media"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'product-media' AND
        ${sql.unsafe(adminCheck)}
      );
    `;

    await sql`
      CREATE POLICY "Admin update to product-media"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'product-media' AND
        ${sql.unsafe(adminCheck)}
      );
    `;

    await sql`
      CREATE POLICY "Admin delete from product-media"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'product-media' AND
        ${sql.unsafe(adminCheck)}
      );
    `;

    console.log('Policies applied successfully.');

  } catch (err) {
    console.error('Error setting up storage:', err);
  } finally {
    await sql.end();
  }
}

setupStorage();
