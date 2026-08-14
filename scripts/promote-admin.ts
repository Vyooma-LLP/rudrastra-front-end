import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email address. Example:\n  npx tsx scripts/promote-admin.ts user@example.com");
    process.exit(1);
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      console.error(`User with email "${email}" not found in database.`);
      process.exit(1);
    }

    await db.update(users).set({ role: 'ADMIN' }).where(eq(users.email, email));
    console.log(`Successfully promoted "${email}" (ID: ${user.id}) to ADMIN role.`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

main();
