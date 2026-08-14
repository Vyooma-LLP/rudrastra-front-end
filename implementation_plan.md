# Phase 5 Execution Audit & P0 Fixes

We need to fix the critical P0 paths to prove the MVP Golden Path works during the final runtime audit. We will fix the three major issues identified and create a comprehensive automated test script.

## User Review Required
> [!IMPORTANT]
> **Supabase Configuration:** The signup API currently fails because Supabase is trying to send a confirmation email but SMTP is not configured (`{"error":"Error sending confirmation email"}`). For the final audit to succeed, you MUST log in to your Supabase Dashboard -> Authentication -> Providers -> Email, and **Turn OFF 'Confirm email'**. 

## Open Questions
- Are there any other hidden P0 MVP features you need me to cover in the final Playwright test (e.g. changing quantities in the cart)? The current plan covers adding to cart and checking out via Quote.

## Proposed Changes

---

### UI & Navigation Fixes

#### [MODIFY] src/components/layout/Navbar.tsx
- Remove `hidden sm:flex` from the authentication controls to ensure Mobile users can see Login/Signup.
- Add Login/Signup buttons to the mobile hamburger menu correctly so they render when the menu is opened.

---

### Backend API Fixes

#### [MODIFY] src/app/api/products/[id]/route.ts
- Catch UUID cast errors gracefully. Return a `404 Not Found` instead of a `500` raw SQL leak when a non-UUID string is provided.

#### [MODIFY] src/app/api/auth/signup/route.ts
- Add fallback logic to treat `"Error sending confirmation email"` as a failed signup rather than leaving the user in limbo. Ensure it returns a clear error message prompting the operator to disable email confirmations in dev mode.

---

### Automated Audit Script

#### [NEW] tests/golden-path.spec.ts
Create a final execution audit script using Playwright that rigorously tests:
1. **Unauthenticated Access**: Verify protected routes (`/cart`, `/quote-request`, `/account`) redirect to login or show errors.
2. **Customer Journey**: 
   - Signup (with valid inputs)
   - Browse Categories -> Products
   - View Product Detail
   - Add to Cart
   - Go to Cart
   - Request Quote (fill form, submit)
   - Verify Quote History page shows the new quote.
3. **Empty/Error States**: Verify 404 behavior for invalid products (using the fixed API).

## Verification Plan

### Automated Tests
- `npx playwright test tests/golden-path.spec.ts`

### Manual Verification
- You will need to manually verify the Admin Quote status update loop since it requires signing out, signing in as Admin, reviewing the specific quote, and then checking it as a Customer. I will provide a clear step-by-step for this in the walkthrough.
