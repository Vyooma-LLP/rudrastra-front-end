import { db } from "../src/db";
import { featureFlags } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function enableAdmin() {
  await db.insert(featureFlags).values({
    featureKey: "admin.catalog",
    enabled: true,
    environment: "production",
    reason: "Seeded for MVP testing"
  }).onConflictDoUpdate({
    target: featureFlags.featureKey,
    set: { enabled: true }
  });
  console.log("Admin flag enabled");
}

enableAdmin().then(async () => {
  // Try calling the api using the dev server if it's running, or just let the user know.
  console.log("Try hitting POST http://localhost:3000/api/admin/products");
}).catch(console.error);
