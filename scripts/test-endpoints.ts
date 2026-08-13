import { db } from '../src/db/index';
import { products } from '../src/db/schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';
let cookies: string[] = [];

async function makeRequest(endpoint: string, method: string = 'GET', body?: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (cookies.length > 0) {
    headers['Cookie'] = cookies.join('; ');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    // native fetch can merge multiple set-cookie into one string separated by comma and space,
    // or return a single one. It's tricky to parse. If we get array we handle it, else just string split.
    // In node 20, headers.getSetCookie() might be available.
    if (typeof response.headers.getSetCookie === 'function') {
      response.headers.getSetCookie().forEach((cookieStr) => {
        cookies.push(cookieStr.split(';')[0]);
      });
    } else {
      const cookieStrs = setCookieHeader.split(', '); // rough split
      cookieStrs.forEach((c) => cookies.push(c.split(';')[0]));
    }
  }

  const text = await response.text();
  try {
    return { status: response.status, data: JSON.parse(text) };
  } catch {
    return { status: response.status, data: text };
  }
}

async function runTests() {
  console.log("=== STARTING PRESSURE TEST ===");
  const testEmail = `testuser${Date.now()}@gmail.com`;
  const password = "SecurePassword123!";
  
  console.log(`\n1. Testing SIGNUP with email: ${testEmail}`);
  const signupRes = await makeRequest('/api/auth/signup', 'POST', {
    email: testEmail,
    password,
    fullName: "Pressure Test User",
    role: "CUSTOMER",
    companyName: "Test Co"
  });
  console.log("Signup Response:", signupRes);

  if (signupRes.status !== 200) {
      console.error("Signup failed, aborting.");
  }

  console.log(`\n2. Testing LOGIN for ${testEmail}`);
  // Clear cookies before login just to be sure we get a fresh session
  cookies = [];
  const loginRes = await makeRequest('/api/auth/login', 'POST', {
    email: testEmail,
    password
  });
  console.log("Login Response:", loginRes);

  console.log("\n3. Testing GET SESSION");
  const sessionRes = await makeRequest('/api/auth/session', 'GET');
  console.log("Session Response:", sessionRes);

  console.log("\n4. Fetching a product from DB to test Cart...");
  const [product] = await db.select().from(products).limit(1);
  if (!product) {
      console.log("No products found in DB to add to cart.");
      return;
  }
  
  console.log(`Adding Product: ${product.title} (ID: ${product.id}) to cart...`);
  const addCartRes = await makeRequest('/api/cart', 'POST', {
      action: 'ADD',
      payload: {
          productId: product.id,
          quantity: 2
      }
  });
  console.log("Add to Cart Response:", addCartRes);

  console.log("\n5. Testing GET CART");
  const getCartRes = await makeRequest('/api/cart', 'GET');
  console.log("Get Cart Response:", getCartRes);

  console.log("\n6. Testing LOGOUT");
  const logoutRes = await makeRequest('/api/auth/logout', 'POST');
  console.log("Logout Response:", logoutRes);

  console.log("\n=== PRESSURE TEST COMPLETE ===");
}

runTests().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
