import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const supabase = await createClient();

        // 1. Sign In using Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 401 });
        }

        if (authData.user) {
            // 2. Fetch corresponding record from PostgreSQL via Drizzle
            const [userRecord] = await db
                .select()
                .from(users)
                .where(eq(users.email, authData.user.email!));

            if (!userRecord) {
                 return NextResponse.json({ error: "User record not found in database" }, { status: 404 });
            }

            const sessionContext = {
                role: userRecord.role.toLowerCase(),
                userEmail: userRecord.email,
                userName: userRecord.fullName,
                userId: userRecord.id,
            };

            return NextResponse.json({ session: sessionContext }, { status: 200 });
        }

        return NextResponse.json({ error: "Login failed" }, { status: 400 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
