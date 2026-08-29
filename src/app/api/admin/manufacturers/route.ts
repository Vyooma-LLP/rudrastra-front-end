import { NextResponse } from 'next/server';
import { db } from '@/db';
import { manufacturers, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
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
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const list = await db.select().from(manufacturers).orderBy(desc(manufacturers.createdAt));
    return NextResponse.json(list);
  } catch (error: any) {
    console.error("Failed to fetch manufacturers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!await verifyAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const body = await req.json();
    
    const newMfg = await db.insert(manufacturers).values({
      name: body.name,
      verified: body.verified || false,
      logo: body.logo || null,
      country: body.country || null,
    }).returning();
    
    return NextResponse.json(newMfg[0]);
  } catch (error: any) {
    console.error("Failed to create manufacturer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
