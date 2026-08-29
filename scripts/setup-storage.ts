import { config } from "dotenv";
import postgres from "postgres";
import fs from "fs";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function main() {
  const sqlString = fs.readFileSync('supabase/storage-setup.sql', 'utf8');
  
  try {
    console.log('Running storage setup script...');
    await sql.unsafe(sqlString);
    console.log('Storage setup complete.');
  } catch (err) {
    console.error('Error running storage setup:', err);
  } finally {
    await sql.end();
  }
}

main();
