import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Loads Supabase DATABASE_URL

import { db } from "../src/db/index";
import { users, sellers, products } from "../src/db/schema";

async function seedHomepage() {
    console.log("Seeding homepage products into Supabase...");

    // 1. Create official vendor seller account
    const [vendorUser] = await db
        .insert(users)
        .values({
            email: "official@vyooma.com",
            fullName: "Vyooma Technologies",
            role: "SELLER",
        })
        .returning();

    const [vendorStore] = await db
        .insert(sellers)
        .values({
            userId: vendorUser.id,
            storeName: "Vyooma Technologies Pvt Ltd",
        })
        .returning();

    // 2. Seed exact products matching your UI cards
    await db.insert(products).values([
        {
            sellerId: vendorStore.id,
            title: "MN4014 Brushless Motor",
            mpn: "MN4014-400KV",
            description: "400 KV | 6S-12S | 8.2kg thrust",
            price: 8450.00,
            stockQty: 100,
        },
        {
            sellerId: vendorStore.id,
            title: "H7 Pro Autopilot",
            mpn: "DM-FC-H7-PRO",
            description: "STM32H7 | Triple IMU | CAN",
            price: 28500.00,
            stockQty: 45,
        },
        {
            sellerId: vendorStore.id,
            title: "XRotor 40A 4-in-1 ESC",
            mpn: "XR-40A-G2",
            description: "40A Cont. | 3-6S LiPo | DSHOT600",
            price: 5100.00,
            stockQty: 80,
        },
    ]);

    console.log("Homepage products seeded successfully into Supabase!");
    process.exit(0);
}

seedHomepage();
