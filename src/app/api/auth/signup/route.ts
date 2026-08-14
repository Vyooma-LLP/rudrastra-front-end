import { createClient } from '@/utils/supabase/server';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password, role, fullName, companyName, gstin } = await request.json();
        const supabase = await createClient();

        // 1. Create User in Supabase Auth (Trigger handles public.users synchronization)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    company_name: companyName || "",
                    gstin: gstin || "",
                    role: role || "CUSTOMER",
                }
            }
        });

        if (authError) {
            // Do not expose internal database errors or trigger constraint failures directly
            if (authError.message.includes("duplicate key value violates unique constraint")) {
                return NextResponse.json({ error: "EMAIL_ALREADY_REGISTERED", message: "An account with this email already exists." }, { status: 400 });
            }
            if (authError.status === 429 || authError.message.toLowerCase().includes('rate limit')) {
                return NextResponse.json({ 
                    error: "RATE_LIMIT_EXCEEDED",
                    message: "Supabase rate limit exceeded. Try again later." 
                }, { status: 429 });
            }
            if (authError.message === "Error sending confirmation email") {
                return NextResponse.json({ 
                    error: "SMTP_ERROR",
                    message: "Signup successful, but unable to send confirmation email. Please contact support." 
                }, { status: 400 });
            }
            if (authError.message === "User already registered") {
                return NextResponse.json({ error: "EMAIL_ALREADY_REGISTERED", message: "An account with this email already exists." }, { status: 400 });
            }
            
            console.error("Auth Service Error:", authError);
            return NextResponse.json({ error: "AUTH_SERVICE_ERROR", message: "Signup failed due to an internal auth error. Please try again." }, { status: 400 });
        }

        if (authData.user) {
            return NextResponse.json({ 
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    role: role || "CUSTOMER"
                } 
            }, { status: 201 });
        }

        return NextResponse.json({ error: "SIGNUP_FAILED", message: "Signup failed." }, { status: 400 });
    } catch (err: any) {
        console.error("Signup internal error:", err);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred during signup." }, { status: 500 });
    }
}