# MVP DATABASE SCHEMA

This document defines the real database schema required for the Rudrastra E-Commerce MVP using PostgreSQL and Drizzle ORM.

## Core Tables

### 1. `users`
Stores user identities and roles.
- `id` (uuid, PK)
- `email` (text, unique)
- `fullName` (text)
- `companyName` (text, nullable)
- `gstin` (text, nullable)
- `role` (text, default: 'USER') - Represents authorization boundary (USER or ADMIN).
- `createdAt` (timestamp)

### 2. `products`
The core catalog. Removes the need for a separate `seller_offers` table for this MVP.
- `id` (uuid, PK)
- `name` / `title` (text)
- `slug` (text, unique)
- `mpn` (text, nullable)
- `description` (text)
- `price` (integer) - Stored in minor units (e.g. paise).
- `currency` (text, default: 'INR')
- `stockQty` (integer, default: 0) - Must be >= 0.
- `category` (text, nullable)
- `imageUrl` (text, nullable)
- `isActive` (boolean, default: true)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### 3. `cart_items`
Stores the persistent shopping cart.
- `id` (uuid, PK)
- `userId` (uuid, FK -> users)
- `productId` (uuid, FK -> products)
- `quantity` (integer) - Must be > 0.
- `updatedAt` (timestamp)

### 4. `orders`
The authoritative record of a completed checkout.
- `id` (uuid, PK)
- `userId` (uuid, FK -> users)
- `status` (text) - e.g., 'PENDING', 'CONFIRMED', 'CANCELLED'.
- `subtotal` (integer) - Minor units.
- `tax` (integer) - Minor units.
- `total` (integer) - Minor units.
- `currency` (text, default: 'INR')
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### 5. `order_items`
Snapshots the state of a product at the time of purchase.
- `id` (uuid, PK)
- `orderId` (uuid, FK -> orders)
- `productId` (uuid, FK -> products)
- `productNameSnapshot` (text) - Protects against product renaming.
- `skuSnapshot` / `mpnSnapshot` (text)
- `unitPrice` (integer) - Minor units.
- `quantity` (integer)
- `lineTotal` (integer) - Minor units.

## Notes on Implementation
- **Money:** Handled exclusively as `integer` minor units to avoid floating-point inaccuracy.
- **Constraints:** Foreign keys enforce cascading or restrict deletes appropriately. Check constraints will be utilized to prevent negative stock/quantities.
- **Security:** Since Drizzle uses the superuser role (`DATABASE_URL`), API endpoints strictly authorize operations by matching `userId` against `supabase.auth.getUser()`.
