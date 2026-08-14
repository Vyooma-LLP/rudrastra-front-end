import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { users, quoteRequests, quoteRequestItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

async function getUserId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    return userRecord?.id || null;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const userId = await getUserId();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [quoteReq] = await db.select().from(quoteRequests).where(
            and(
                eq(quoteRequests.id, id),
                eq(quoteRequests.userId, userId) // Strict IDOR protection
            )
        );

        if (!quoteReq) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        const items = await db.select().from(quoteRequestItems).where(eq(quoteRequestItems.quoteRequestId, quoteReq.id));

        return NextResponse.json({ quote: quoteReq, items }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
