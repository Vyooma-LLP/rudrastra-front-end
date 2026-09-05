import { db } from "./src/db";
import { sql } from "drizzle-orm";
async function run() {
  const result = await db.execute(sql`SELECT DISTINCT media_type, asset_role FROM product_media`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
run();
