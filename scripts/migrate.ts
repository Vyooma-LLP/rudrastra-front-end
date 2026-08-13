import 'dotenv/config';
import { db } from "../src/db";
import { sql } from "drizzle-orm";
import fs from "fs";

async function main() {
  const query = fs.readFileSync("drizzle/0003_wakeful_blur.sql", "utf-8");
  await db.execute(sql.raw(query));
  console.log("Migration applied");
}

main().catch(console.error).finally(() => process.exit(0));
