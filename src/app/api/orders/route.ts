import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { isFeatureEnabled } from "@/lib/features";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    if (!await isFeatureEnabled('commerce.orders')) {
      return NextResponse.json({ error: "FEATURE_DISABLED" }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = userRecord.id;

    // Securely fetch only the authenticated user's orders
    const userOrders = await db.select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
    
    // Fetch items for each order
    const ordersWithItems = await Promise.all(userOrders.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        return { ...order, items };
    }));

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error: unknown) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
  }
}
