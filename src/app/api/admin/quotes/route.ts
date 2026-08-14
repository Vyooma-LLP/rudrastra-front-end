import { NextResponse } from "next/server";
import { db } from "@/db";
import { quoteRequests, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from '@/utils/supabase/server';

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord || userRecord.role !== 'ADMIN') return false;

    return true;
}

export async function GET() {
    try {
        if (!await verifyAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const quotes = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
        return NextResponse.json({ quotes }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
    }
}
