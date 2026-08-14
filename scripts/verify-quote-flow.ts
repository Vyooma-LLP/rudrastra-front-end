import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import dotenv from 'dotenv';
import ws from 'ws';
(global as any).WebSocket = ws;
dotenv.config({ path: '.env.local' });

async function verifyQuoteFlow() {
  console.log('Starting Quote Flow Verification...');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  // 1. Log in with an existing test user
  const email = `testuser1786549830330@gmail.com`;
  const password = 'TestPassword123!';
  console.log(`Logging in test user: ${email}`);
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;
  const userId = authData.user!.id;
  console.log(`User logged in with ID: ${userId}`);

  // Ensure public.users row exists
  await db.insert(schema.users).values({
    id: userId,
    email: email,
    role: 'USER',
    fullName: 'Test User'
  }).onConflictDoNothing();

  // 2. Add an item to the cart
  // Find a product to add
  const prods = await db.select().from(schema.products).limit(1);
  if (prods.length === 0) {
    throw new Error('No products found in DB');
  }
  
  const productId = prods[0].id;

  // Add to cart directly via DB to simulate Cart interaction
  console.log(`Adding product ${productId} to cart for user ${userId}`);
  const cartRes = await db.insert(schema.cartItems).values({
    userId,
    productId,
    quantity: 2,
    updatedAt: new Date()
  }).returning();
  
  console.log('Cart item added:', cartRes[0]);

  // 3. Make the API call to Request Quote
  console.log('Fetching session to make API call...');
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  
  if (!token) throw new Error('No auth token available');

  const idempotencyKey = crypto.randomUUID();
  console.log('Submitting Quote Request API call...');
  
  // Note: we can't easily fetch Next.js localhost if it's not running consistently, 
  // but it's running via dev server on port 3000. Let's try port 3000.
  const apiRes = await fetch('http://localhost:3000/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      idempotencyKey,
      customerInfo: {
        name: 'Test Customer',
        email,
        phone: '9999999999',
        companyName: 'Test Corp',
        notes: 'Please quote quickly'
      },
      shippingAddress: {
        line1: 'Test Address 1',
        line2: '',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081'
      }
    })
  });

  const apiData = await apiRes.json();
  if (!apiRes.ok) {
    console.error('API Error:', apiData);
    throw new Error('Quote request failed');
  }

  console.log('Quote Request successful:', apiData);
  const quoteId = apiData.quoteId;

  // 4. Verification in DB
  console.log('\n--- VERIFICATION ---');
  
  // Verify exactly one quote_requests record
  const quotes = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, quoteId));
  console.log(`Found ${quotes.length} quote_requests record(s) for this run.`);
  if (quotes.length !== 1) throw new Error('Failed verification: Quote not found');

  // Verify cart is empty
  const cartItems = await db.select().from(schema.cartItems).where(eq(schema.cartItems.userId, userId));
  console.log(`Found ${cartItems.length} cart items. Expected: 0.`);
  if (cartItems.length !== 0) throw new Error('Cart not empty after quote request');

  // Duplicate submission test
  console.log('Testing duplicate submission (same idempotencyKey)...');
  const duplicateRes = await fetch('http://localhost:3000/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      idempotencyKey,
      customerInfo: {
        name: 'Test Customer',
        email,
        phone: '9999999999',
        companyName: 'Test Corp',
        notes: 'Please quote quickly'
      },
      shippingAddress: {
        line1: 'Test Address 1',
        line2: '',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081'
      }
    })
  });
  
  const duplicateData = await duplicateRes.json();
  console.log('Duplicate request response:', duplicateData);
  if (!duplicateRes.ok) throw new Error('Duplicate submission failed idempotency check');
  if (duplicateData.quoteId !== quoteId) throw new Error('Idempotency returned different quote ID!');
  
  console.log('\n✅ ALL MVP CONSTRAINTS VERIFIED SUCCESSFULLY.');
  process.exit(0);
}

verifyQuoteFlow().catch(console.error);
