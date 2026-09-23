import { test, expect } from '@playwright/test';
import crypto from 'crypto';

// P0 - Internal Error Disclosure
//
// src/app/api/auth/login/route.ts (and session/logout/switch-role) used to catch
// DB/internal errors and return `err.message` verbatim to the client — for the
// Drizzle/postgres path this leaked raw SQL text and bind parameters (observed
// directly during a Staging connectivity outage: the client received
// `Failed query: select "id", "email", ... from "users" where "users"."email" = $1
// params: <email>`). Fixed by logging internally and returning a fixed public
// message. This test asserts no auth route ever leaks SQL/DB fingerprints,
// regardless of whether the specific failure is reproduced.
//
// NOTE: reliably forcing the DB-query catch block requires a live Supabase Auth
// call (so `signInWithPassword` succeeds) immediately followed by a broken
// `DATABASE_URL` for the subsequent Drizzle lookup — i.e. it needs an active
// Staging project. This suite is written and committed but was NOT executed
// against Staging as part of this change (Staging was intentionally left
// paused). Run it the next time Staging is active, ideally after the
// connectivity-first sequence (see PHASE_E notes) rather than jumping straight
// to Playwright.

const baseUrl = 'http://localhost:3000';

const SQL_FINGERPRINTS = [
  /select\s+".*"\s+from\s+"/i,
  /failed query/i,
  /params:/i,
  /postgres(error)?:/i,
  /ECONNREFUSED/i,
  /tenant\/user/i,
  /\bat\s+\/.*\.(ts|js):\d+/, // stack trace line
];

function assertNoLeak(body: unknown) {
  const text = JSON.stringify(body);
  for (const pattern of SQL_FINGERPRINTS) {
    expect(text, `response leaked an internal detail matching ${pattern}`).not.toMatch(pattern);
  }
}

test.describe('P0 - Auth routes never leak internal/DB error details', () => {
  test('login with unknown credentials returns a clean, generic error', async ({ request }) => {
    const res = await request.post(`${baseUrl}/api/auth/login`, {
      data: { email: `nope_${crypto.randomBytes(4).toString('hex')}@example.com`, password: 'WrongPassword123!' },
    });
    const body = await res.json();
    assertNoLeak(body);
  });

  test('session lookup while unauthenticated returns a clean response', async ({ request }) => {
    const res = await request.get(`${baseUrl}/api/auth/session`);
    const body = await res.json();
    assertNoLeak(body);
  });

  test('logout never leaks internal details even if called without a session', async ({ request }) => {
    const res = await request.post(`${baseUrl}/api/auth/logout`);
    const body = await res.json();
    assertNoLeak(body);
  });

  test('switch-role without auth returns Unauthorized, not internal details', async ({ request }) => {
    const res = await request.post(`${baseUrl}/api/auth/switch-role`, { data: { role: 'ADMIN' } });
    const body = await res.json();
    expect(res.status()).toBe(401);
    assertNoLeak(body);
  });

  // Reproduces the exact failure mode found during this session: a valid,
  // authenticated login where the subsequent Drizzle/Postgres lookup fails.
  // Requires DATABASE_URL to be broken for the test process while Supabase
  // Auth itself stays reachable — see file header. Skipped by default.
  test.skip('login succeeds at Auth but DB lookup fails -> generic 500, no SQL leak', async ({ request }) => {
    const email = `disclosure_${crypto.randomBytes(4).toString('hex')}@example.com`;
    const password = 'TestPassword123!';
    await request.post(`${baseUrl}/api/auth/signup`, {
      data: { email, password, fullName: 'Disclosure Test', companyName: 'Disclosure Inc' },
    });
    const res = await request.post(`${baseUrl}/api/auth/login`, { data: { email, password } });
    expect(res.status()).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Authentication failed');
    assertNoLeak(body);
  });
});
