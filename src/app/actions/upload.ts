"use server";

import { createClient } from "@/utils/supabase/server";
import { db } from "@/db/index";
import { sellers, productVariants, sellerOffers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function generateSignedUploadUrl(
  fileName: string,
  contentType: string,
  context?: { productId?: string; variantId?: string }
) {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 2. Authorize SELLER role
  if (user.user_metadata?.role !== "SELLER" && user.user_metadata?.role !== "ADMIN" && user.user_metadata?.role !== "OPS") {
    throw new Error("Forbidden: Only authorized roles can upload media");
  }

  // 3. Resolve Seller ID if the user is a SELLER
  let sellerId = null;
  if (user.user_metadata?.role === "SELLER") {
    const [seller] = await db
      .select({ id: sellers.id })
      .from(sellers)
      .where(eq(sellers.userId, user.id));

    if (!seller) {
      throw new Error("Forbidden: Seller account not found");
    }
    sellerId = seller.id;
  }

  // 4. Verify Ownership: per the frozen architecture, catalog_products are canonical
  // and NOT seller-owned — a seller only has standing on a product/variant through an
  // active seller_offer. Do not accept the client's role claim as authorization by itself.
  if (sellerId && context?.variantId) {
    const [offer] = await db
      .select({ id: sellerOffers.id })
      .from(sellerOffers)
      .where(and(eq(sellerOffers.sellerId, sellerId), eq(sellerOffers.variantId, context.variantId)));

    if (!offer) {
      throw new Error("Forbidden: You do not have an offer on this variant");
    }
  } else if (sellerId && context?.productId) {
    const [offer] = await db
      .select({ id: sellerOffers.id })
      .from(sellerOffers)
      .innerJoin(productVariants, eq(sellerOffers.variantId, productVariants.id))
      .where(and(eq(sellerOffers.sellerId, sellerId), eq(productVariants.productId, context.productId)));

    if (!offer) {
      throw new Error("Forbidden: You do not have an offer on this product");
    }
  }
  // No context (context.productId/variantId omitted) is treated as an unattached
  // draft upload and is scoped to the seller's own `sellers/{sellerId}/drafts/` path below.

  // 5. Construct Trusted Path
  const fileExt = fileName.split(".").pop();
  const generatedId = crypto.randomUUID();
  let trustedPath = "";

  if (sellerId) {
    if (context?.productId) {
       trustedPath = `sellers/${sellerId}/products/${context.productId}/${generatedId}.${fileExt}`;
    } else {
       trustedPath = `sellers/${sellerId}/drafts/${generatedId}.${fileExt}`;
    }
  } else {
    // Admins / Ops
    if (context?.productId) {
       trustedPath = `catalog/products/${context.productId}/${generatedId}.${fileExt}`;
    } else {
       trustedPath = `catalog/general/${generatedId}.${fileExt}`;
    }
  }

  // 6. Generate Signed URL
  // The authorization decision already happened above (role + seller-offer ownership).
  // Storage RLS on `product-media` stays ADMIN/OPS-only (see 0004_storage_baseline.sql);
  // we use the service_role client only to mint a short-lived, single-path upload
  // capability for `trustedPath` — a scoped credential, not a bypass of the security model.
  const serviceClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data, error } = await serviceClient.storage
    .from("product-media")
    .createSignedUploadUrl(trustedPath);

  if (error) {
    throw new Error(`Failed to generate upload URL: ${error.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    path: trustedPath,
    token: data.token,
    fullUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/${trustedPath}`
  };
}
