import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';

async function main() {
  console.log('Running migrations...');
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    
  }
}

main();
