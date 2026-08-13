import { pgTable, uuid, text, timestamp, integer, boolean, unique, jsonb, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    companyName: text("company_name"),
    gstin: text("gstin"),
    role: text("role").default("USER").notNull(), // 'USER' | 'ADMIN'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Sellers Table (Dormant for MVP)
export const sellers = pgTable("sellers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    storeName: text("store_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Products Table (MVP Core)
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "cascade" }), // Nullable for MVP
    title: text("title").notNull(),
    slug: text("slug").unique(),
    mpn: text("mpn"),
    sku: text("sku"),
    description: text("description"),
    price: integer("price").notNull(), // Minor units (paise)
    currency: text("currency").default('INR').notNull(),
    stockQty: integer("stock_qty").default(0).notNull(),
    category: text("category"),
    imageUrl: text("image_url"),
    specifications: jsonb("specifications"),
    isActive: boolean("is_active").default(true).notNull(), // Soft delete / deactivation
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        priceCheck: check("products_price_check", sql`price >= 0`),
        stockCheck: check("products_stock_check", sql`stock_qty >= 0`)
    }
});

// 4. Cart Items Table
export const cartItems = pgTable("cart_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Orders Table
export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    status: text("status").notNull(), // 'PENDING', 'CONFIRMED', 'CANCELLED'
    subtotal: integer("subtotal").notNull(), // Minor units
    tax: integer("tax").notNull(),
    total: integer("total").notNull(),
    currency: text("currency").default('INR').notNull(),
    shippingName: text("shipping_name").notNull(),
    shippingPhone: text("shipping_phone").notNull(),
    shippingAddressLine1: text("shipping_address_line1").notNull(),
    shippingAddressLine2: text("shipping_address_line2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state").notNull(),
    shippingPincode: text("shipping_pincode").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Order Items Table
export const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }), // Keep record if product deleted
    productNameSnapshot: text("product_name_snapshot").notNull(),
    skuSnapshot: text("sku_snapshot"),
    unitPrice: integer("unit_price").notNull(), // Minor units
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(), // Minor units
}, (table) => {
    return {
        quantityCheck: check("order_items_quantity_check", sql`quantity > 0`),
        priceCheck: check("order_items_price_check", sql`unit_price >= 0`)
    }
});

// 7. Feature Flags (Kill Switch)
export const featureFlags = pgTable("feature_flags", {
    id: uuid("id").primaryKey().defaultRandom(),
    featureKey: text("feature_key").notNull().unique(),
    enabled: boolean("enabled").default(false).notNull(),
    environment: text("environment").default('production').notNull(),
    reason: text("reason"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Feature Flag Audit
export const featureFlagAudit = pgTable("feature_flag_audit", {
    id: uuid("id").primaryKey().defaultRandom(),
    featureKey: text("feature_key").notNull(),
    oldState: boolean("old_state").notNull(),
    newState: boolean("new_state").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, { onDelete: "set null" }),
    reason: text("reason"),
    environment: text("environment").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Idempotency Keys (For safe checkout retries)
export const idempotencyKeys = pgTable("idempotency_keys", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id),
    operation: text("operation").notNull(),
    idempotencyKey: text("idempotency_key").notNull(),
    requestHash: text("request_hash"), // Added for diff payload check
    status: text("status").notNull(), // COMPLETED, FAILED, EXPIRED (Removed PROCESSING)
    response: text("response"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
}, (table) => {
    return {
        // Enforce uniqueness for idempotent keys per user and operation
        uniqueKey: unique("unique_idempotency_key").on(table.userId, table.operation, table.idempotencyKey)
    }
});