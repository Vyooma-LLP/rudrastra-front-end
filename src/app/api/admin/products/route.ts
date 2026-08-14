import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";
import { createClient } from '@/utils/supabase/server';

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord || userRecord.role !== 'ADMIN') return false;

    return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!await verifyAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!await isFeatureEnabled('admin.catalog')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const data = await req.json();
    
    // Minimal validation
    if (!data.title || data.price === undefined) {
        return NextResponse.json({ error: "VALIDATION_ERROR", message: "Title and price are required" }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      title: data.title,
      mpn: data.mpn,
      sku: data.sku,
      description: data.description,
      price: data.price,
      currency: data.currency || "INR",
      stockQty: data.stockQty || 0,
      category: data.category,
      imageUrl: data.imageUrl,
      specifications: data.specifications,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();

    return NextResponse.json({ product: newProduct });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
  }
}
