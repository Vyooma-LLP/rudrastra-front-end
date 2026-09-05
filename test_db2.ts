import { db } from "./src/db";
import { sql } from "drizzle-orm";
async function run() {
  const result = await db.execute(sql`SELECT cad_images FROM products WHERE cad_images IS NOT NULL`);
  console.log("Products with cad_images:", result.length);
  if (result.length > 0) {
      console.log(JSON.stringify(result, null, 2));
  }
  process.exit(0);
}
run();
