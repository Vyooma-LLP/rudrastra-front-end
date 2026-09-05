import { db } from "./src/db";
import { productMedia } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function run() {
  const result = await db.select().from(productMedia).where(eq(productMedia.productId, "8cb2377f-32d2-4613-a959-52647806c6cf"));
  console.log("productMedia rows:", result.length);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
run();
