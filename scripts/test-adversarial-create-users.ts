import { db } from "../src/db";
import { users } from "../src/db/schema";
import crypto from "crypto";

async function createUsers() {
    await db.insert(users).values([
        { id: crypto.randomUUID(), email: "testuser1@example.com", fullName: "Test User 1" },
        { id: crypto.randomUUID(), email: "testuser2@example.com", fullName: "Test User 2" }
    ]);
    console.log("Users created");
}
createUsers().catch(console.error);
