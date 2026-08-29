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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    if (!await verifyAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isFeatureEnabled('opsProductEngine')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const data = await req.json();
    
    if (!data.title || data.price === undefined) {
        return NextResponse.json({ error: "VALIDATION_ERROR", message: "Title and price are required" }, { status: 400 });
    }

    const [updatedProduct] = await db.update(products).set({
      title: data.title,
      mpn: data.mpn,
      description: data.description,
      categoryId: data.categoryId,
      imageUrl: data.imageUrl,
      isActive: data.isActive !== undefined ? data.isActive : true,
      updatedAt: new Date(),
    }).where(eq(products.id, id)).returning();

    if (!updatedProduct) {
        return NextResponse.json({ error: "NOT_FOUND", message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: updatedProduct });
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
  }
}
