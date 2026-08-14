import React from 'react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const [userProfile] = await db.select().from(users).where(eq(users.email, authUser.email!));
  
  if (!userProfile) {
    redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Edit Profile</h1>
        <p className="text-xs text-[#777777]">Update your contact details and default shipping address.</p>
      </div>

      <ProfileForm userProfile={userProfile} />
    </div>
  );
}
