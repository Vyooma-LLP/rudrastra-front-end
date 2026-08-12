import { createClient } from "../../../../../utils/supabase/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password, role } = await request.json();
        const supabase = await createClient();

        // 1. Create User in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        if (authData.user) {
            // 2. Insert corresponding record into PostgreSQL via Drizzle
            const [newUser] = await db
                .insert(users)
                .values({
                    email: authData.user.email!,
                    role: role || "BUYER",
                })
                .returning();

            return NextResponse.json({ user: newUser }, { status: 201 });
        }

        return NextResponse.json({ error: "Signup failed" }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}