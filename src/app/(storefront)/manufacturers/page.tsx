import { db } from "@/db";
import ManufacturersClient from "./ManufacturersClient";

export default async function ManufacturersPageServer() {
  const manufacturers = await db.query.manufacturers.findMany();
  
  // Map database properties to the UI expectations
  const mappedManufacturers = manufacturers.map((m) => ({
    id: m.id,
    name: m.name,
    origin: m.country || "Global",
    expertise: "General Engineering", // Default since it's missing in DB
    tier: m.verified ? "Verified" : "Standard",
    count: 0, // Would need an aggregation query to get product count
    link: `/manufacturers/${m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    img: m.logo || "/images/products/rudrastra_motor_1785921295587.png" // Fallback UI image
  }));

  return <ManufacturersClient dbManufacturers={mappedManufacturers} />;
}
