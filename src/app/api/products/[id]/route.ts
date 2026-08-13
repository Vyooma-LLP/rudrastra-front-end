import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await isFeatureEnabled('catalog.products')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const { id } = await params;

    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return NextResponse.json({ error: "NOT_FOUND", message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 });
  }
}
