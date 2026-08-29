import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { db } from '../../src/db';
import * as schema from '../../src/db/schema';
import { eq, like, inArray } from 'drizzle-orm';
import { CONTRACTS } from './fixtures/contract-manifest';
import type { RealityGateRuntime } from './fixtures/reality-gate.fixture';

// ─── Test Config ─────────────────────────────────────────────────────────────
const RUN_PREFIX = 'RG-TEST-';
const RUN_ID = `${RUN_PREFIX}${Date.now()}-${Math.floor(Math.random() * 10000)}`;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_PASSWORD = 'Reality@Gate123!';

const EMAILS = {
  admin: `admin-${RUN_ID.toLowerCase()}@rudrastra-test.internal`,
  seller: `seller-${RUN_ID.toLowerCase()}@rudrastra-test.internal`,
  customer: `customer-${RUN_ID.toLowerCase()}@rudrastra-test.internal`,
};

const TEST_DATA = {
  runId: RUN_ID,
  manufacturer: { name: `RealityGate Mfg ${RUN_ID}` },
  product: {
    title: `Reality Gate Motor ${RUN_ID}`,
    mpn: `RGM-${RUN_ID}`,
    variantName: `Standard 400KV`,
  },
  seller: {
    storeName: `Test Co ${RUN_ID.slice(-8)}`,
    companyName: `Test Co ${RUN_ID.slice(-8)}`,
  },
  sku: { code: `RG-SKU-${RUN_ID}` },
};

let runtimeState: RealityGateRuntime = {
  runId: RUN_ID,
  admin: { userId: '', email: EMAILS.admin },
  seller: { userId: '', sellerId: '', email: EMAILS.seller, storeName: TEST_DATA.seller.storeName },
  customer: { userId: '', email: EMAILS.customer }
};

// ─── Idempotent Cleanup ────────────────────────────────────────────────────
async function doCleanup(prefix: string) {
  const testUsers = await db.select({ id: schema.users.id }).from(schema.users).where(like(schema.users.email, `%${prefix.toLowerCase()}%`));
  if (testUsers.length > 0) {
    const userIds = testUsers.map(u => u.id);
    await db.delete(schema.idempotencyKeys).where(inArray(schema.idempotencyKeys.userId, userIds));
    await db.delete(schema.users).where(inArray(schema.users.id, userIds));
  }
  await db.delete(schema.products).where(like(schema.products.mpn, `RGM-${prefix}%`));
  await db.delete(schema.manufacturers).where(like(schema.manufacturers.name, `RealityGate Mfg ${prefix}%`));
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe.serial('Marketplace Reality Gate', () => {
  let adminCtx: BrowserContext;
  let sellerCtx: BrowserContext;
  let customerCtx: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    await doCleanup(RUN_ID); // Clean only exact current run ID (zero cost on fresh start)

    async function signupViaApi(email: string, role: 'CUSTOMER' | 'SELLER') {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: TEST_PASSWORD, fullName: `Test ${role} ${RUN_ID.slice(-8)}`, companyName: TEST_DATA.seller.storeName, role }),
      });
      const body = await res.json();
      if (!res.ok && body.error !== 'EMAIL_ALREADY_REGISTERED') throw new Error(`Signup failed: ${JSON.stringify(body)}`);
    }

    await signupViaApi(EMAILS.admin, 'CUSTOMER');
    await signupViaApi(EMAILS.seller, 'SELLER');
    await signupViaApi(EMAILS.customer, 'CUSTOMER');

    const [adminUser] = await db.select().from(schema.users).where(eq(schema.users.email, EMAILS.admin)).limit(1);
    await db.update(schema.users).set({ role: 'ADMIN' }).where(eq(schema.users.id, adminUser.id));
    
    const [sellerUser] = await db.select().from(schema.users).where(eq(schema.users.email, EMAILS.seller)).limit(1);
    let sellerRec = await db.select().from(schema.sellers).where(eq(schema.sellers.userId, sellerUser.id)).limit(1);
    if (!sellerRec.length) {
      await db.insert(schema.sellers).values({ userId: sellerUser.id, storeName: TEST_DATA.seller.storeName });
      sellerRec = await db.select().from(schema.sellers).where(eq(schema.sellers.userId, sellerUser.id)).limit(1);
    }

    const [customerUser] = await db.select().from(schema.users).where(eq(schema.users.email, EMAILS.customer)).limit(1);

    runtimeState.admin.userId = adminUser.id;
    runtimeState.seller.userId = sellerUser.id;
    runtimeState.seller.sellerId = sellerRec[0].id;
    runtimeState.customer.userId = customerUser.id;

    adminCtx = await browser.newContext();
    sellerCtx = await browser.newContext();
    customerCtx = await browser.newContext();

    const login = async (ctx: BrowserContext, email: string) => {
      const p = await ctx.newPage();
      await p.goto(CONTRACTS.auth.login.route);
      await p.getByLabel(CONTRACTS.auth.login.controls[0]).fill(email);
      await p.getByLabel(CONTRACTS.auth.login.controls[1]).fill(TEST_PASSWORD);
      await p.getByRole('button', { name: new RegExp(CONTRACTS.auth.login.controls[2], 'i') }).click();
      await p.waitForFunction(() => !window.location.pathname.startsWith('/login'), { timeout: 60000 });
      await p.close();
    };

    await login(adminCtx, EMAILS.admin);
    await login(sellerCtx, EMAILS.seller);
    await login(customerCtx, EMAILS.customer);
  });

  test.afterAll(async () => {
    await adminCtx?.close();
    await sellerCtx?.close();
    await customerCtx?.close();
    await doCleanup(RUN_ID);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GATE 1: BROWSER SEMANTIC SMOKE
  // ─────────────────────────────────────────────────────────────────────────────
  test('Gate 1: Browser Semantic Smoke (Auth & Controls)', async () => {
    const page = await customerCtx.newPage();
    
    await page.goto(CONTRACTS.auth.login.route);
    for(const label of CONTRACTS.auth.login.controls.slice(0,2)) await expect(page.getByLabel(label)).toBeVisible();
    
    await page.goto(CONTRACTS.auth.signupCustomer.route);
    for(const label of CONTRACTS.auth.signupCustomer.controls.slice(0,3)) await expect(page.getByLabel(label)).toBeVisible();
    
    await page.goto(CONTRACTS.auth.signupSeller.route);
    for(const label of CONTRACTS.auth.signupSeller.controls.slice(0,4)) await expect(page.getByLabel(label)).toBeVisible();
    
    await page.close();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GATE 2: EXPLICIT STATEFUL LIFECYCLE
  // ─────────────────────────────────────────────────────────────────────────────
  test('Gate 2: Explicit Stateful Lifecycle (Option B)', async () => {
    test.setTimeout(180000);
    
    // STEP 1: MANUFACTURER
    await test.step('Step 1 - Manufacturer', async () => {
      const p = await adminCtx.newPage();
      await p.goto(CONTRACTS.manufacturer.route);
      await p.getByRole('button', { name: 'Add Manufacturer' }).click();
      await p.getByLabel('Manufacturer Name').fill(TEST_DATA.manufacturer.name);
      await p.getByLabel('Country of Origin').fill('India');
      const mfgRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.manufacturer.mutation.path) && r.request().method() === CONTRACTS.manufacturer.mutation.method);
      await p.getByRole('button', { name: 'Save' }).click();
      const mfgRes = await mfgRsp;
      await mfgRes.finished();
      expect(mfgRes.ok(), `Manufacturer POST failed: ${mfgRes.status()}`).toBeTruthy();
      
      const [mfg] = await db.select().from(schema.manufacturers).where(eq(schema.manufacturers.name, TEST_DATA.manufacturer.name)).limit(1);
      expect(mfg).toBeTruthy();
      runtimeState.manufacturer = { id: mfg.id, name: mfg.name };
      await p.close();
    });

    // STEP 2: PRODUCT
    await test.step('Step 2 - Product', async () => {
      const p = await adminCtx.newPage();
      await p.goto(CONTRACTS.product.route);
      await p.getByLabel('Manufacturer').selectOption({ label: runtimeState.manufacturer!.name });
      const categorySelect = p.getByLabel('Category');
      const categoryOption = await categorySelect.locator('option').last().textContent();
      await categorySelect.selectOption({ label: categoryOption || '' });
      await p.getByRole('button', { name: 'Next: Basic Info' }).click();
      await p.getByLabel('Product Title / Family Name').fill(TEST_DATA.product.title);
      await p.getByLabel('Manufacturer Part Number (MPN)').fill(TEST_DATA.product.mpn);
      await p.getByLabel('Description').fill(`Reality Gate test product`);
      await p.getByRole('button', { name: 'Next: Media' }).click();
      await p.getByRole('button', { name: 'Next: Variants' }).click();
      await p.getByLabel('Variant Name').fill(TEST_DATA.product.variantName);
      // Product creation uses a Next.js Server Action (no client-side fetch).
      // Synchronize via navigation to the success URL instead of waitForResponse.
      await p.getByRole('button', { name: 'Create Product' }).click();
      await p.waitForURL('**/ops/catalog/products', { timeout: 30000 });
      
      const [prod] = await db.select().from(schema.products).where(eq(schema.products.mpn, TEST_DATA.product.mpn)).limit(1);
      expect(prod, 'Product not found in DB after Server Action navigation').toBeTruthy();
      const [variant] = await db.select().from(schema.productVariants).where(eq(schema.productVariants.productId, prod.id)).limit(1);
      runtimeState.product = { id: prod.id, mpn: prod.mpn!, title: prod.title ?? TEST_DATA.product.title };
      runtimeState.variant = { id: variant.id };
      await p.close();
    });

    // STEP 3: OFFER
    await test.step('Step 3 - Offer', async () => {
      const p = await sellerCtx.newPage();
      await p.goto(CONTRACTS.offer.route);
      await p.getByLabel('Canonical Product Variant').selectOption({ value: runtimeState.variant!.id });
      await p.getByLabel('Your SKU Code').fill(TEST_DATA.sku.code);
      await p.getByLabel('Price (₹)').fill('2999.00');
      await p.getByLabel('MOQ').fill('5');
      await p.getByLabel('Lead Time (Days)').fill('7');
      const offerRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.offer.mutation.path) && r.request().method() === CONTRACTS.offer.mutation.method);
      await p.getByRole('button', { name: /Save Offer/i }).click();
      const offerRes = await offerRsp;
      await offerRes.finished();
      expect(offerRes.ok(), `Offer POST failed: ${offerRes.status()}`).toBeTruthy();
      
      const [sku] = await db.select().from(schema.sellerSkus).where(eq(schema.sellerSkus.skuCode, TEST_DATA.sku.code)).limit(1);
      expect(sku).toBeTruthy();
      runtimeState.sku = { id: sku.id, code: sku.skuCode };
      await p.close();
    });

    // STEP 4: INVENTORY
    await test.step('Step 4 - Inventory', async () => {
      const p = await sellerCtx.newPage();
      await p.goto(CONTRACTS.inventory.route);
      await p.getByLabel('Select SKU').selectOption({ value: runtimeState.sku!.id });
      await p.getByLabel('Total On-Hand Quantity').fill('100');
      const invRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.inventory.mutation.path) && r.request().method() === CONTRACTS.inventory.mutation.method);
      await p.getByRole('button', { name: 'Update Stock' }).click();
      const invRes = await invRsp;
      await invRes.finished();
      expect(invRes.ok(), `Inventory POST failed: ${invRes.status()}`).toBeTruthy();
      
      const [inv] = await db.select().from(schema.inventoryItems).where(eq(schema.inventoryItems.skuId, runtimeState.sku!.id)).limit(1);
      expect(inv.onHandQuantity).toBe(100);
      await p.close();
    });

    // STEP 5: CART
    await test.step('Step 5 - Cart', async () => {
      const p = await customerCtx.newPage();
      await p.goto('/products');
      await p.getByPlaceholder('Search MPN').fill(runtimeState.product!.mpn);
      await p.getByRole('button', { name: 'Search' }).click();
      const productCard = p.getByTestId('product-card').filter({ hasText: runtimeState.product!.mpn });
      await productCard.click();
      await p.waitForURL('**/products/**');
      
      const pdpOfferRow = p.getByTestId('pdp-offer-row').filter({ hasText: runtimeState.seller.storeName });
      const cartRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.cart.mutation.path) && r.request().method() === CONTRACTS.cart.mutation.method);
      await pdpOfferRow.getByTestId('pdp-add-to-cart').click();
      const cartRes = await cartRsp;
      await cartRes.finished();
      expect(cartRes.ok(), `Cart POST failed: ${cartRes.status()}`).toBeTruthy();
      
      const [cartItem] = await db.select().from(schema.cartItems).where(eq(schema.cartItems.userId, runtimeState.customer.userId)).limit(1);
      expect(cartItem).toBeTruthy();
      await p.close();
    });

    // STEP 6: RFQ
    await test.step('Step 6 - RFQ', async () => {
      const p = await customerCtx.newPage();
      await p.goto('/cart');
      await p.getByRole('link', { name: /Request Quote/i }).click();
      await p.getByLabel('Full Name *').fill('Test Customer');
      await p.getByLabel('Email Address *').fill(runtimeState.customer.email);
      await p.getByLabel('Phone Number *').fill('9876543210');
      await p.getByLabel('Delivery Address (Comma separated for MVP) *').fill('123 Test St, Test City, TS, 500001');
      const quoteRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.quote.mutation.path) && r.request().method() === CONTRACTS.quote.mutation.method);
      await p.getByRole('button', { name: 'Submit Quote Request' }).click();
      const quoteRes = await quoteRsp;
      await quoteRes.finished();
      expect(quoteRes.ok(), `Quote POST failed: ${quoteRes.status()}`).toBeTruthy();
      
      const [quote] = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.userId, runtimeState.customer.userId)).limit(1);
      expect(quote).toBeTruthy();
      runtimeState.quote = { id: quote.id };
      await p.close();
    });

    // STEP 7: APPROVAL
    await test.step('Step 7 - Approval', async () => {
      const p = await adminCtx.newPage();
      await p.goto(CONTRACTS.approval.route);
      const [finalQuote] = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, runtimeState.quote!.id)).limit(1);
      
      const quoteRow = p.getByTestId('quote-row').filter({ hasText: finalQuote.quoteNumber });
      await quoteRow.getByRole('link', { name: 'Review' }).click();
      const statusSelect = p.getByRole('combobox');
      await statusSelect.selectOption({ label: 'ACCEPTED' });
      const approvalRsp = p.waitForResponse(r => r.url().includes(CONTRACTS.approval.mutation.path) && r.request().method() === CONTRACTS.approval.mutation.method);
      await p.getByRole('button', { name: 'Save' }).click();
      const approvalRes = await approvalRsp;
      await approvalRes.finished();
      expect(approvalRes.ok(), `Approval PATCH failed: ${approvalRes.status()}`).toBeTruthy();
      
      const [processedQuote] = await db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, finalQuote.id)).limit(1);
      expect(processedQuote.status).toBe('ACCEPTED');
      await p.close();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GATE 3: INDEPENDENT SECURITY / AUTHORIZATION TESTS
  // ─────────────────────────────────────────────────────────────────────────────
  test('Gate 3: Seller cannot access Seller offers without auth context', async () => {
    const page = await customerCtx.newPage();
    const response = await page.goto(CONTRACTS.offer.route);
    const finalUrl = page.url();
    const status = response?.status() ?? 0;
    await page.close();
    expect(!finalUrl.includes(CONTRACTS.offer.route) || status === 401 || status === 403 || status === 404).toBeTruthy();
  });
});
