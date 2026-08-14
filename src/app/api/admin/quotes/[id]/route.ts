import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quoteRequests, quoteRequestItems, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from '@/utils/supabase/server';

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord || userRecord.role !== 'ADMIN') return false;

    return true;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!await verifyAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [quote] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id));
        
        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const items = await db.select().from(quoteRequestItems).where(eq(quoteRequestItems.quoteRequestId, id));

        return NextResponse.json({ quote, items }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        if (!await verifyAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const [updatedQuote] = await db.update(quoteRequests)
            .set({ status, updatedAt: new Date() })
            .where(eq(quoteRequests.id, id))
            .returning();

        if (!updatedQuote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        return NextResponse.json({ quote: updatedQuote }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
    }
}
