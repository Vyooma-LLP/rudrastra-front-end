# MVP API SPECIFICATION

This document outlines the **only APIs implemented** for the Rudrastra E-Commerce MVP.

## Authentication (`/api/auth/*`)
- `POST /api/auth/signup`: Registers a new user via Supabase Auth and mirrors them into the `users` table.
- `POST /api/auth/login`: Authenticates an existing user and establishes a session.
- `POST /api/auth/logout`: Clears the user's session.
- `GET /api/auth/session`: Retrieves the current authenticated user session context.

## Catalog (`/api/products/*`)
- `GET /api/products`: Retrieves active products (supports basic `?q=` search and `?category=` filter).
- `GET /api/products/:id`: Retrieves details for a specific product.

## Commerce (`/api/cart/*`)
- `GET /api/cart`: Retrieves the authenticated user's current cart and securely calculates the subtotal, GST, and total.
- `POST /api/cart` (Action: ADD, UPDATE, REMOVE): Mutates the cart items. Includes server-side validation against active products, valid quantities, and stock limits.

## Checkout & Orders (`/api/checkout` & `/api/orders/*`)
- `POST /api/checkout`: Validates the current cart, calculates authoritative totals, creates an `order` and `order_items`, decrements product stock, and clears the user's cart. Returns the created `orderId`.
- `GET /api/orders`: Retrieves the authenticated user's order history.
- `GET /api/orders/:id`: Retrieves a specific order (enforcing ownership).

## Admin (`/api/admin/*`)
- *All admin routes require the authenticated user to have `role === 'ADMIN'`.*
- `POST/PUT /api/admin/products`: Create or update product details (price, stock, active status).
- `GET/PUT /api/admin/orders`: View all orders and update statuses (e.g., Pending -> Confirmed).
