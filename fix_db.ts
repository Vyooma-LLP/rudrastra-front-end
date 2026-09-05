import { db } from "./src/db";
import { productMedia } from "./src/db/schema";
import { eq, inArray } from "drizzle-orm";

async function run() {
  const result = await db.update(productMedia)
    .set({ assetRole: "drawing" })
    .where(
      inArray(productMedia.id, [
        "5a26027a-f593-463a-8567-b0e291fb53d5",
        "6002f4ff-b610-4e15-b654-c238a2cb09b4"
      ])
    );
  console.log("Updated rows.");
  process.exit(0);
}
run();
