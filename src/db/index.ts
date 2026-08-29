import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is missing in .env.local!");
}

// Explicit client configuration to prevent fallback to localhost
const client = postgres(connectionString, {
    prepare: false,
    ssl: "require",
});

export const db = drizzle(client, { schema });