import { createClient } from "../../../../../utils/supabase/server";
import { db } from "@/db/index";
import { users, sellers } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password, role, fullName, companyName, gstin } = await request.json();
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
            const [newUser] = await db
                .insert(users)
                .values({
                    email: authData.user.email!,
                    fullName,
                    companyName,
                    gstin,
                    role: role || "BUYER",
                })
                .returning();

            if (newUser.role === "SELLER") {
                await db.insert(sellers).values({
                    userId: newUser.id,
                    storeName: companyName || fullName,
                });
            }

            return NextResponse.json({ user: newUser }, { status: 201 });
        }

        return NextResponse.json({ error: "Signup failed" }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}