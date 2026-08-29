import { NextResponse } from 'next/server';
import { db } from '@/db';
import { manufacturers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
    if (!userRecord || userRecord.role !== 'ADMIN') return false;

    return true;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await verifyAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    
    const updated = await db.update(manufacturers).set({
      name: body.name,
      verified: body.verified,
      logo: body.logo,
      country: body.country,
      updatedAt: new Date(),
    }).where(eq(manufacturers.id, id)).returning();
    
    if (updated.length === 0) {
      return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error("Failed to update manufacturer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const deleted = await db.delete(manufacturers).where(eq(manufacturers.id, id)).returning();
    
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Manufacturer not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete manufacturer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
