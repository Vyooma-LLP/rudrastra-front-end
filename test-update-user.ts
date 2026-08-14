import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdateUser() {
    const email = `hacker_${crypto.randomBytes(4).toString('hex')}@example.com`;
    const password = 'TestPassword123!';
    
    console.log('Signing up...');
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: 'ADMIN', // Try to inject at signup
                full_name: 'Hacker'
            }
        }
    });
    if (error) throw error;
    
    console.log('Updating user metadata post-signup...');
    const { error: updateError } = await supabase.auth.updateUser({
        data: { role: 'ADMIN' }
    });
    if (updateError) throw updateError;
    
    console.log('Fetching from DB...');
    // Because RLS allows users to read their own profile, we can fetch it via anon client
    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user!.id)
        .single();
    if (profileError) throw profileError;
    
    console.log('DB Role:', profile.role);
    console.log('Metadata Role:', data.user!.user_metadata.role);
    
    if (profile.role === 'ADMIN') {
        console.error('FAIL: Privilege escalation successful!');
        process.exit(1);
    } else {
        console.log('PASS: DB Role is still ' + profile.role);
        process.exit(0);
    }
}
testUpdateUser().catch(console.error);
