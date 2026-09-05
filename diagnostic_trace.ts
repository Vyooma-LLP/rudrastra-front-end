import { resolveProductAssets } from "./src/lib/catalog/product-media";

async function run() {
  console.log("=== 1 & 2 & 3. API Response ===");
  const res = await fetch("http://localhost:3000/api/products/8cb2377f-32d2-4613-a959-52647806c6cf");
  const data = await res.json();
  
  console.log("4. Raw productMedia received:");
  console.log(JSON.stringify(data.product?.productMedia, null, 2));

  console.log("\n=== 5. Output of resolveProductAssets ===");
  const cadImages = resolveProductAssets(data.product, { assetRole: "drawing" });
  console.log(JSON.stringify(cadImages, null, 2));

  console.log("\n=== 6 & 7. Rendering Decision (Simulated) ===");
  cadImages.forEach((url, i) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    console.log(`[${i}] ${url}`);
    console.log(`  -> isImage: ${isImage} -> Will render as: ${isImage ? "<Image>" : "<a href>Download</a>"}`);
  });
}
run().catch(console.error);
