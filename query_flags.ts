import { db } from './src/db';
import { featureFlags } from './src/db/schema';
async function main() {
  const flags = await db.select().from(featureFlags);
  console.log(flags);
  process.exit(0);
}
main();
