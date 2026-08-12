import { pgTable, uuid, text, timestamp, numeric, integer } from "drizzle-orm/pg-core";

// 1. Users Table (Updated with full UI form fields)
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    companyName: text("company_name"),
    gstin: text("gstin"),
    role: text("role").default("BUYER").notNull(), // 'BUYER' | 'SELLER'
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Sellers Table
export const sellers = pgTable("sellers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    storeName: text("store_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Products Table
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    mpn: text("mpn"),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    stockQty: integer("stock_qty").default(0).notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Cart Items Table
export const cartItems = pgTable("cart_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});