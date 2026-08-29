export const CONTRACTS = {
  auth: {
    login: {
      route: '/login',
      controls: ['Work / Corporate Email', 'Password', 'Sign In'],
    },
    signupCustomer: {
      route: '/signup?role=customer',
      controls: ['Full Name', 'Work Email', 'Password', 'Create Account'],
    },
    signupSeller: {
      route: '/signup?role=seller',
      controls: ['Full Name', 'Company / Entity Name', 'Work Email', 'Password', 'Create Account'],
    }
  },
  manufacturer: {
    route: '/ops/catalog/manufacturers',
    mutation: { method: 'POST', path: '/api/admin/manufacturers' },
  },
  product: {
    route: '/ops/catalog/products/new',
    // Uses Next.js Server Action — no client-side fetch. Sync via waitForURL after submit.
    successUrl: '/ops/catalog/products',
    mutation: null,
  },
  offer: {
    route: '/seller/offers/new',
    mutation: { method: 'POST', path: '/api/seller/offers' },
  },
  inventory: {
    route: '/seller/inventory/new',
    mutation: { method: 'POST', path: '/api/seller/inventory' },
  },
  cart: {
    mutation: { method: 'POST', path: '/api/cart' },  // actual: SupabaseCartAdapter → /api/cart
  },
  quote: {
    route: '/quote-request',
    mutation: { method: 'POST', path: '/api/quotes' },  // actual: /api/quotes not /api/customer/quotes
  },
  approval: {
    route: '/ops/quotes',
    mutation: { method: 'PATCH', path: '/api/admin/quotes' },
  },
};
