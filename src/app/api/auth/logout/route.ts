import { createClient } from '@/utils/supabase/server';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const supabase = await createClient();
        await supabase.auth.signOut();
        const cookieStore = await cookies();
        cookieStore.delete('dev_role_override');
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        console.error("Logout failed", err);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
