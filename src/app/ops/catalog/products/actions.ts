"use server";

import { db } from "@/db";
import { products, productVariants, productSpecValues, productMedia, mediaCleanupJobs } from "@/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { users } from "@/db/schema";
import { SupabaseStorageProvider } from "@/lib/storage/SupabaseStorageProvider";

const storageProvider = new SupabaseStorageProvider();

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord || userRecord.role !== 'ADMIN') return false;

    return true;
}

const validPhysicalMediaTypes = ['image', 'video', 'document', 'cad'];
const validAssetRoles = ['datasheet', 'performance_data', 'test_report', 'certification', 'manual', 'drawing', 'general'];

async function validateMedia(mediaList: any[]) {
  if (!mediaList || mediaList.length === 0) return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = await createClient(); // Authenticated server client

  for (const item of mediaList) {
    if (!validPhysicalMediaTypes.includes(item.mediaType)) {
      throw new Error(`Invalid media type: ${item.mediaType}`);
    }
    
    if (item.assetRole && !validAssetRoles.includes(item.assetRole)) {
      throw new Error(`Invalid asset role: ${item.assetRole}`);
    }
    
    if (supabaseUrl && !item.url.startsWith(supabaseUrl)) {
       throw new Error(`External URLs are not permitted. Asset must belong to the approved storage origin.`);
    }

    try {
      const urlParts = item.url.split(`/object/public/product-media/`);
      if (urlParts.length !== 2) {
        throw new Error(`Invalid storage URL format: ${item.url}`);
      }
      
      const filePath = urlParts[1];
      const folder = filePath.substring(0, filePath.lastIndexOf('/')) || '';
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

      // Verify existence via authenticated storage API instead of unauthenticated HTTP HEAD
      const { data, error } = await supabase.storage
        .from('product-media')
        .list(folder || '', {
          search: fileName,
          limit: 1
        });

      if (error) {
        throw new Error(`Failed to query storage for URL: ${item.url}. ${error.message}`);
      }

      if (!data || data.length === 0 || data[0].name !== fileName) {
        throw new Error(`Asset not found in storage: ${item.url}`);
      }
      
      // Optionally validate metadata (MIME type)
      const metadata = (data[0].metadata as any) || {};
      const contentType = metadata.mimetype || '';
      
      if (item.mediaType === 'image' && contentType && !contentType.startsWith('image/')) {
        throw new Error(`MIME type mismatch: Expected image, got ${contentType}`);
      }
      if (item.mediaType === 'video' && contentType && !contentType.startsWith('video/')) {
        throw new Error(`MIME type mismatch: Expected video, got ${contentType}`);
      }
      if (contentType.includes('executable') || contentType.includes('x-sh') || contentType.includes('msdownload')) {
        throw new Error(`MIME type mismatch: Malicious or unrecognized content type. Got ${contentType}`);
      }
    } catch (e: any) {
      if (e.message.includes('MIME type mismatch') || e.message.includes('External URLs') || e.message.includes('Invalid media type') || e.message.includes('Invalid asset role') || e.message.includes('Asset not found')) {
        throw e;
      }
      throw new Error(`Unable to validate media URL: ${item.url}. Error: ${e.message}`);
    }
  }
}

export async function createFullProduct(data: any) {
  try {
    if (!await verifyAdmin()) {
        throw new Error("Unauthorized");
    }

    // 1. Pre-transaction Fail-Closed Media Validation
    await validateMedia(data.media);

    const productId = await db.transaction(async (tx) => {
      const [product] = await tx.insert(products).values({
        manufacturerId: data.manufacturerId || null,
        categoryId: data.categoryId,
        title: data.title,
        mpn: data.mpn,
        normalizedMpn: data.mpn?.toLowerCase().replace(/[^a-z0-9]/g, ""),
        description: data.description,
        isActive: true,
      }).returning();

      // 2. Insert media with Server-Authoritative Ordering
      if (data.media && data.media.length > 0) {
        const mediaValues = data.media.map((item: any, index: number) => {
          return {
            productId: product.id,
            url: item.url,
            mediaType: item.mediaType,
            assetRole: item.assetRole || 'general',
            sortOrder: index, // Server-derived ordering (ignoring client sort)
            altText: item.altText,
          };
        });
        await tx.insert(productMedia).values(mediaValues);
      }

      for (const variant of data.variants) {
        const [insertedVariant] = await tx.insert(productVariants).values({
          productId: product.id,
          categoryId: data.categoryId,
          name: variant.name,
          canonicalSku: variant.sku,
          isActive: true,
        }).returning();

        if (variant.specs && variant.specs.length > 0) {
          const specValues = variant.specs.map((spec: any) => ({
            variantId: insertedVariant.id,
            specId: spec.specId,
            categoryId: data.categoryId,
            valueString: spec.valueString,
            valueNumber: spec.valueNumber,
            valueBoolean: spec.valueBoolean,
          }));
          await tx.insert(productSpecValues).values(specValues);
        }
      }
      return product.id;
    });

    try {
      revalidatePath("/ops/catalog/products");
    } catch (e) {
      // Ignore if outside Next.js context
    }
    return productId;
  } catch (error: any) {
    if (
      error.code === '23505' || 
      (error.cause && error.cause.code === '23505') ||
      (error.message && error.message.includes('unique_catalog_identity'))
    ) {
      error = new Error("A product with this Manufacturer Part Number (MPN) already exists.");
    }
    
    // 3. Durable Compensating Deletion for Orphaned Storage Objects
    if (data.media && data.media.length > 0) {
      console.warn("Transaction failed, deleting orphaned media objects...");
      for (const item of data.media) {
        try {
          // If the item URL is external, skip attempting to delete from our bucket
          if (process.env.NEXT_PUBLIC_SUPABASE_URL && item.url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
             await storageProvider.delete(item.url);
          }
        } catch (e: any) {
          console.error(`Failed to cleanup orphaned object: ${item.url}`, e);
          try {
            await db.insert(mediaCleanupJobs).values({
              storagePath: item.url,
              reason: "Transaction rollback orphan",
              lastError: e.message || "Unknown storage error",
              status: "pending"
            });
          } catch (dbErr) {
            console.error("FATAL: Failed to insert media cleanup job", dbErr);
          }
        }
      }
    }
    throw error;
  }
}

export async function updateFullProduct(data: any) {
  if (!data.id) throw new Error("Product ID is required for update");

  try {
    if (!await verifyAdmin()) {
        throw new Error("Unauthorized");
    }

    // 1. Pre-transaction Fail-Closed Media Validation
    await validateMedia(data.media);

    let oldMediaUrls: string[] = [];

    await db.transaction(async (tx) => {
      // 2. Optimistic Concurrency Protection (Lost Update Prevention)
      const expectedVersion = data.version || 1;
      const updateResult = await tx.update(products).set({
        title: data.title,
        mpn: data.mpn,
        normalizedMpn: data.mpn?.toLowerCase().replace(/[^a-z0-9]/g, ""),
        description: data.description,
        version: sql`version + 1`,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, data.id), eq(products.version, expectedVersion)))
      .returning({ id: products.id });

      if (updateResult.length === 0) {
        throw new Error("CONCURRENCY_CONFLICT");
      }

      // Re-sync media (Delete and Reinsert)
      const oldMedia = await tx.select({ url: productMedia.url }).from(productMedia).where(eq(productMedia.productId, data.id));
      oldMediaUrls = oldMedia.map(m => m.url);
      
      await tx.delete(productMedia).where(eq(productMedia.productId, data.id));
      if (data.media && data.media.length > 0) {
        const mediaValues = data.media.map((item: any, index: number) => {
          return {
            productId: data.id,
            url: item.url,
            mediaType: item.mediaType,
            assetRole: item.assetRole || 'general',
            sortOrder: index, // Server-derived ordering
            altText: item.altText,
          };
        });
        await tx.insert(productMedia).values(mediaValues);
      }

      // Handle variants
      for (const variant of data.variants) {
        let variantId = variant.id;
        if (variant.id && !variant.id.startsWith("new_")) {
          await tx.update(productVariants).set({
            name: variant.name,
            canonicalSku: variant.sku,
            updatedAt: new Date(),
          }).where(eq(productVariants.id, variant.id));
        } else {
          const [insertedVariant] = await tx.insert(productVariants).values({
            productId: data.id,
            categoryId: data.categoryId,
            name: variant.name,
            canonicalSku: variant.sku,
            isActive: true,
          }).returning();
          variantId = insertedVariant.id;
        }

        // Spec values update (delete old, insert new)
        await tx.delete(productSpecValues).where(eq(productSpecValues.variantId, variantId));
        if (variant.specs && variant.specs.length > 0) {
          const specValues = variant.specs.map((spec: any) => ({
            variantId: variantId,
            specId: spec.specId,
            categoryId: data.categoryId,
            valueString: spec.valueString,
            valueNumber: spec.valueNumber,
            valueBoolean: spec.valueBoolean,
          }));
          await tx.insert(productSpecValues).values(specValues);
        }
      }
    });

    // 3. Clean up obsolete storage objects after successful transaction
    if (oldMediaUrls.length > 0) {
      const newMediaUrls = data.media ? data.media.map((m: any) => m.url) : [];
      const obsoleteUrls = oldMediaUrls.filter(url => !newMediaUrls.includes(url));
      
      for (const url of obsoleteUrls) {
        try {
          if (process.env.NEXT_PUBLIC_SUPABASE_URL && url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
             await storageProvider.delete(url);
          }
        } catch (e: any) {
          console.error(`Failed to cleanup obsolete object: ${url}`, e);
          try {
            await db.insert(mediaCleanupJobs).values({
              storagePath: url,
              reason: "Obsolete object after update",
              lastError: e.message || "Unknown storage error",
              status: "pending"
            });
          } catch (dbErr) {
            console.error("FATAL: Failed to insert media cleanup job", dbErr);
          }
        }
      }
    }

    try {
      revalidatePath("/", "layout");
      revalidatePath("/ops/catalog/products");
      revalidatePath(`/products/${data.id}`);
    } catch (e) {
      // Ignore outside Next.js
    }
    return data.id;
  } catch (error: any) {
    if (error.message === "CONCURRENCY_CONFLICT") {
       throw new Error("Conflict: This product was updated by another user. Please refresh and try again.");
    }
    if (
      error.code === '23505' || 
      (error.cause && error.cause.code === '23505') ||
      (error.message && error.message.includes('unique_catalog_identity'))
    ) {
      error = new Error("A product with this Manufacturer Part Number (MPN) already exists.");
    }
    
    // Durable Compensating Deletion for newly uploaded orphaned objects during failed update
    if (data.media && data.media.length > 0) {
      console.warn("Update transaction failed. Any new media objects uploaded in this session will need cleanup via sweeping.");
    }
    throw error;
  }
}

export async function getExistingAssets(mediaTypes?: string[]) {
  if (!await verifyAdmin()) {
      throw new Error("Unauthorized");
  }

  // Asset Authorization: Ensure we only expose canonical assets from active products
  let condition = eq(products.isActive, true) as any;
  if (mediaTypes && mediaTypes.length > 0) {
     condition = and(condition, inArray(productMedia.mediaType, mediaTypes));
  }

  const assets = await db.select({
    id: productMedia.id,
    url: productMedia.url,
    mediaType: productMedia.mediaType,
    assetRole: productMedia.assetRole,
    altText: productMedia.altText,
    createdAt: productMedia.createdAt,
    productTitle: products.title,
  })
  .from(productMedia)
  .leftJoin(products, eq(productMedia.productId, products.id))
  .where(condition)
  .orderBy(desc(productMedia.createdAt))
  .limit(50);
  
  return assets;
}

export async function deleteProduct(id: string) {
  try {
    if (!await verifyAdmin()) {
        throw new Error("Unauthorized");
    }

    await db.transaction(async (tx) => {
      // First, get all variants to delete their spec values
      const variants = await tx.select({ id: productVariants.id }).from(productVariants).where(eq(productVariants.productId, id));
      for (const v of variants) {
        await tx.delete(productSpecValues).where(eq(productSpecValues.variantId, v.id));
      }
      // Delete variants
      await tx.delete(productVariants).where(eq(productVariants.productId, id));
      
      // Delete media
      const media = await tx.select({ url: productMedia.url }).from(productMedia).where(eq(productMedia.productId, id));
      await tx.delete(productMedia).where(eq(productMedia.productId, id));
      
      // Attempt to clean up physical storage objects
      if (media && media.length > 0) {
        for (const item of media) {
          try {
            if (process.env.NEXT_PUBLIC_SUPABASE_URL && item.url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
              await storageProvider.delete(item.url);
            }
          } catch (e: any) {
            console.error(`Failed to cleanup orphaned object: ${item.url}`, e);
          }
        }
      }

      // Finally delete the product
      await tx.delete(products).where(eq(products.id, id));
    });

    try {
      revalidatePath("/ops/catalog/products");
    } catch (e) {
      // Ignore outside Next.js
    }
    return true;
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product: " + (error.message || "Unknown error"));
  }
}
