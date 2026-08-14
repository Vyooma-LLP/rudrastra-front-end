import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [userRecord] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!));

        if (!userRecord || userRecord.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { role } = await request.json();
        
        const cookieStore = await cookies();
        cookieStore.set('dev_role_override', role, {
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        const sessionContext = {
            role: role,
            userEmail: userRecord.email,
            userName: userRecord.fullName,
            userId: userRecord.id,
            isSystemAdmin: userRecord.role === 'ADMIN',
        };

        return NextResponse.json({ session: sessionContext }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
