import { createClient } from '@/utils/supabase/server';
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ session: null }, { status: 200 });
        }

        const [userRecord] = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!));

        if (!userRecord) {
            return NextResponse.json({ error: "User record not found" }, { status: 404 });
        }

        let role = userRecord.role.toLowerCase();
        if (userRecord.role === 'ADMIN') {
            const cookieStore = await cookies();
            const devRole = cookieStore.get('dev_role_override')?.value;
            if (devRole) {
                role = devRole;
            }
        }

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
