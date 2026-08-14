import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userProfile] = await db.select().from(users).where(eq(users.email, authUser.email!));

    if (!userProfile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: userProfile });
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // Update the profile in the database
    const [updatedUser] = await db.update(users).set({
      fullName: data.fullName,
      phone: data.phone,
      companyName: data.companyName,
      gstin: data.gstin,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    }).where(eq(users.email, authUser.email!)).returning();

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: updatedUser });
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: (error as Error).message }, { status: 500 });
  }
}
