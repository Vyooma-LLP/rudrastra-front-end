import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, or, and, desc, asc } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";

export async function GET(req: NextRequest) {
  try {
    if (!await isFeatureEnabled('catalog.products')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');

    let conditions = [];
    if (category) {
      conditions.push(
        or(
          eq(products.category, category),
          ilike(products.category, `${category} > %`)
        )
      );
    }
    if (q) {
      conditions.push(
        or(
          ilike(products.title, `%${q}%`),
          ilike(products.description, `%${q}%`)
        )
      );
    }

    let query = db.select().from(products);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    if (sort === 'price_asc') {
      query = query.orderBy(asc(products.price)) as any;
    } else if (sort === 'price_desc') {
      query = query.orderBy(desc(products.price)) as any;
    } else if (sort === 'newest') {
      query = query.orderBy(desc(products.createdAt)) as any;
    }

    const allProducts = await query;

    return NextResponse.json({ products: allProducts });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 });
  }
}
