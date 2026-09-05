import { db } from "./src/db";
import { products } from "./src/db/schema";
import { eq, ilike } from "drizzle-orm";
import { resolveProductAssets } from "./src/lib/catalog/product-media";

async function main() {
    const prod = await db.query.products.findFirst({
        where: ilike(products.mpn, "%rud%"),
        with: {
            productMedia: true
        }
    });
    
    console.log("resolveProductAssets:", resolveProductAssets(prod, { assetRole: "drawing" }));
    process.exit(0);
}

main().catch(console.error);
