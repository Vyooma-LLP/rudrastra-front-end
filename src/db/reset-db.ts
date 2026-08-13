import { db } from './index';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function resetAndMigrate() {
  console.log('Dropping schema public...');
  try {
    await db.execute(sql`DROP SCHEMA public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
    console.log('Schema dropped and recreated.');
    
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations successful!');
  } catch (err) {
    console.error('Error during reset:', err);
  } finally {
    
  }
}

resetAndMigrate();
