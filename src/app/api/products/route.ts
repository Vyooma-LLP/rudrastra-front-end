import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, or, and, desc, asc } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!isFeatureEnabled('storefrontSell')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');

    let conditions = [];
    if (category) {
      // TODO: Implement category ID filtering
    }
    if (q) {
      conditions.push(
        or(
          ilike(products.title, `%${q}%`),
          ilike(products.description, `%${q}%`),
          ilike(products.mpn, `%${q}%`)
        )
      );
    }

    let query = db.select().from(products);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    if (sort === 'newest') {
      query = query.orderBy(desc(products.createdAt)) as any;
    } else {
      // Default to newest first
      query = query.orderBy(desc(products.createdAt)) as any;
    }

    const allProducts = await query;

    return NextResponse.json({ products: allProducts });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: "Internal server error" }, { status: 500 });
  }
}
