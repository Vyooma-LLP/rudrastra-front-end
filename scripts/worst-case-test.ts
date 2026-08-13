import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
Object.assign(global, { WebSocket });
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_BASE = 'http://localhost:3000/api';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runWorstCaseTests() {
  console.log('=== STARTING WORST-CASE SCENARIO TESTS ===\n');

  // Test 1: RLS Bypass Attempt (Direct Supabase API without auth)
  console.log('--- TEST 1: RLS Bypass Attempt ---');
  console.log('Attempting to read users table directly using anon key...');
  const { data: users, error: rlsError } = await supabase.from('users').select('*');
  if (rlsError) {
    console.log('✅ PASS: RLS successfully blocked unauthorized direct DB access.');
  } else {
    console.log('❌ FAIL: RLS is misconfigured or missing on users table! Data leaked:', users?.length, 'records.');
  }
  
  // Test 2: API Auth Bypass (No Token)
  console.log('\n--- TEST 2: Unauthenticated API Access ---');
  console.log('Attempting to read cart without session cookie...');
  const cartRes = await fetch(`${API_BASE}/cart`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (cartRes.status === 401) {
    console.log('✅ PASS: /api/cart correctly returned 401 Unauthorized.');
  } else {
    console.log(`❌ FAIL: /api/cart returned ${cartRes.status} without authentication!`);
  }

  // Test 3: SQL Injection Payload via Add to Cart
  console.log('\n--- TEST 3: SQL Injection Payload ---');
  console.log("Attempting to add to cart with payload: ' OR 1=1; DROP TABLE users; --");
  const sqliRes = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mpn: "' OR 1=1; DROP TABLE users; --",
      sellerId: "invalid-seller",
      quantity: 1
    })
  });
  
  // Even without auth, it should fail gracefully, not crash or execute the SQL
  if (sqliRes.status === 401) {
      console.log('✅ PASS: Request caught by Auth wall before SQL processing.');
  } else if (sqliRes.status === 400 || sqliRes.status === 404) {
      console.log('✅ PASS: Payload handled gracefully, SQL injection mitigated.');
  } else if (sqliRes.status >= 500) {
      console.log('❌ FAIL: Internal server error - possible unhandled SQL exception.');
      console.log(await sqliRes.text());
  }

  // Test 4: Concurrency / Race Condition (DDoS-lite on local API)
  console.log('\n--- TEST 4: Race Condition / Concurrency Test ---');
  console.log('Sending 50 simultaneous requests to the /api/cart endpoint...');
  const start = Date.now();
  const promises = [];
  for (let i = 0; i < 50; i++) {
    promises.push(fetch(`${API_BASE}/cart`));
  }
  
  const results = await Promise.all(promises);
  const end = Date.now();
  
  const statuses = results.map(r => r.status);
  const successCount = statuses.filter(s => s === 401).length; // Expecting 401 since we are unauth
  const failCount = statuses.length - successCount;
  
  console.log(`Completed 50 requests in ${end - start}ms`);
  if (failCount === 0) {
    console.log('✅ PASS: Server handled 50 concurrent requests cleanly without crashing or hanging.');
  } else {
    console.log(`❌ FAIL: ${failCount} requests failed or timed out unexpectedly.`);
  }

  console.log('\n=== WORST-CASE TESTS COMPLETE ===');
}

runWorstCaseTests().catch(console.error);
