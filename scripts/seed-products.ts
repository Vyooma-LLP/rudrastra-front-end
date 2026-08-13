import { db } from "../src/db";
import { products } from "../src/db/schema";
import { sql } from "drizzle-orm";
import { featureFlags } from "../src/db/schema";

async function seed() {
  console.log("Seeding products...");
  
  await db.insert(featureFlags).values({
    featureKey: "catalog.products",
    enabled: true,
    environment: "production",
    reason: "Seeded for MVP"
  }).onConflictDoUpdate({
    target: featureFlags.featureKey,
    set: { enabled: true }
  });

  const sampleProducts = [
    {
      title: "400KV Brushless Motor",
      mpn: "MN4014",
      description: "The MN4014 is a highly efficient propulsion motor designed for professional aerial photography and industrial applications. Features extreme reliability and minimal vibration.",
      price: 1245000,
      currency: "INR",
      stockQty: 50,
      category: "Propulsion",
      imageUrl: "/images/products/rudrastra_motor_1785921295587.png",
      isActive: true,
    },
    {
      title: "Pro Autopilot Controller",
      mpn: "Pixhawk 6X",
      description: "Pro Autopilot Controller with STM32H753 MCU and Triple IMU.",
      price: 1820000,
      currency: "INR",
      stockQty: 25,
      category: "Flight Control",
      imageUrl: "/images/products/rudrastra_fc_1785921305227.png",
      isActive: true,
    },
    {
      title: "4-in-1 BLHeli_32 ESC",
      mpn: "XRotor 40A",
      description: "High performance 4-in-1 ESC with 40A continuous current.",
      price: 680000,
      currency: "INR",
      stockQty: 100,
      category: "Power",
      imageUrl: "/images/products/rudrastra_esc_1785921326270.png",
      isActive: true,
    }
  ];

  for (const p of sampleProducts) {
    await db.insert(products).values(p);
  }
  
  console.log("Done seeding products.");
}

seed().catch(console.error);
