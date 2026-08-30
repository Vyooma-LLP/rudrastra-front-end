import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("DATABASE_URL is missing. Using dummy URL for build."); connectionString = "postgresql://dummy:dummy@localhost:5432/dummy";
}

// Explicit client configuration to prevent fallback to localhost
const client = postgres(connectionString, {
    prepare: false,
    ssl: "require",
});

export const db = drizzle(client, { schema });