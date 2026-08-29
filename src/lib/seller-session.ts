/**
 * requireSellerSession — Zero-Trust Seller Identity Resolution
 * ============================================================
 * NEVER trust a client-supplied sellerId.
 * This function is the ONLY authoritative way to resolve the current seller's identity.
 *
 * Usage (in Route Handlers and Server Components):
 *   const { sellerId, userId } = await requireSellerSession();
 *
 * Throws a NextResponse with 401 or 403 if:
 *   - No authenticated session exists
 *   - The authenticated user has no associated seller record
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { sellers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type SellerSession = {
  sellerId: string;
  userId: string;
  storeName: string;
};

/**
 * For use inside Next.js Route Handlers (API routes).
 * Returns seller context or throws a NextResponse error.
 */
export async function requireSellerSession(): Promise<SellerSession> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw NextResponse.json(
      { error: 'UNAUTHENTICATED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  const [sellerRecord] = await db
    .select({
      id: sellers.id,
      userId: sellers.userId,
      storeName: sellers.storeName,
    })
    .from(sellers)
    .where(eq(sellers.userId, user.id))
    .limit(1);

  if (!sellerRecord) {
    throw NextResponse.json(
      { error: 'SELLER_NOT_FOUND', message: 'No seller account associated with this session.' },
      { status: 403 }
    );
  }

  return {
    sellerId: sellerRecord.id,
    userId: user.id,
    storeName: sellerRecord.storeName,
  };
}

/**
 * For use inside Server Components (pages).
 * Returns seller context or null — caller must redirect appropriately.
 */
export async function getSellerSession(): Promise<SellerSession | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [sellerRecord] = await db
      .select({
        id: sellers.id,
        userId: sellers.userId,
        storeName: sellers.storeName,
      })
      .from(sellers)
      .where(eq(sellers.userId, user.id))
      .limit(1);

    if (!sellerRecord) return null;

    return {
      sellerId: sellerRecord.id,
      userId: user.id,
      storeName: sellerRecord.storeName,
    };
  } catch {
    return null;
  }
}
