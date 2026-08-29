import { pgTable, uuid, text, timestamp, integer, boolean, unique, jsonb, check, foreignKey, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    fullName: text("full_name").notNull(),
    companyName: text("company_name"),
    gstin: text("gstin"),
    phone: text("phone"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    pincode: text("pincode"),
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

// 3. Manufacturers Table
export const manufacturers = pgTable("manufacturers", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    verified: boolean("verified").default(false).notNull(),
    logo: text("logo"),
    country: text("country"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3a. Badges Table
export const badges = pgTable("badges", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    iconUrl: text("icon_url"),
});

// 3b. Manufacturer Badges Table
export const manufacturerBadges = pgTable("manufacturer_badges", {
    manufacturerId: uuid("manufacturer_id").references(() => manufacturers.id, { onDelete: "cascade" }).notNull(),
    badgeId: uuid("badge_id").references(() => badges.id, { onDelete: "cascade" }).notNull(),
}, (table) => {
    return {
        pk: unique("unique_manufacturer_badge").on(table.manufacturerId, table.badgeId)
    }
});

// 3c. Categories Table
export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id"), // Self-referencing for taxonomy (e.g. Motors -> Brushless Motors)
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3d. Specification Definitions Table (PIM)
export const specDefinitions = pgTable("spec_definitions", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(), // e.g. "KV Rating", "Weight"
    dataType: text("data_type").notNull(), // 'number', 'string', 'boolean'
    unit: text("unit"), // e.g. "KV", "g", "mm"
    isRequired: boolean("is_required").default(false).notNull(),
}, (table) => {
    return {
        uniqueCategorySpecDef: unique("unique_category_spec_def").on(table.id, table.categoryId)
    }
});

// 3e. Products Table (Canonical Family)
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    manufacturerId: uuid("manufacturer_id").references(() => manufacturers.id, { onDelete: "set null" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
    title: text("title").notNull(),
    slug: text("slug").unique(),
    mpn: text("mpn"),
    normalizedMpn: text("normalized_mpn"), // For unique constraint (manufacturer_id, normalized_mpn)
    description: text("description"),
    imageUrl: text("image_url"),
    performanceData: jsonb("performance_data"),
    cadImages: jsonb("cad_images"),
    isActive: boolean("is_active").default(true).notNull(),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        uniqueCatalogIdentity: unique("unique_catalog_identity").on(table.manufacturerId, table.normalizedMpn),
        uniqueProductCategory: unique("unique_product_category").on(table.id, table.categoryId)
    }
});

// 3f. Product Media Table (Canonical Media)
export const productMedia = pgTable("product_media", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    mediaType: text("media_type").default('image').notNull(), // 'image', 'video', 'cad', 'document'
    assetRole: text("asset_role").default('general').notNull(), // 'datasheet', 'performance_data', 'test_report', 'certification', 'manual', 'drawing', 'general'
    sortOrder: integer("sort_order").notNull(),
    altText: text("alt_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        uniqueProductSortOrder: unique("unique_product_sort_order").on(table.productId, table.sortOrder),
        sortOrderCheck: check("sort_order_check", sql`sort_order >= 0`),
        mediaTypeCheck: check("product_media_type_check", sql`media_type IN ('image', 'video', 'cad', 'document')`),
        assetRoleCheck: check("product_media_asset_role_check", sql`asset_role IN ('datasheet', 'performance_data', 'test_report', 'certification', 'manual', 'drawing', 'general')`),
        productIdx: index("product_media_product_idx").on(table.productId)
    }
});

// 3g. Product Variants Table (Canonical Sellable Variations)
export const productVariants = pgTable("product_variants", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull(),
    categoryId: uuid("category_id").notNull(), // Denormalized for invariant enforcement
    name: text("name").notNull(), // e.g. "400KV", "500KV"
    canonicalSku: text("canonical_sku"), // Optional global SKU if exists
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        productCategoryFk: foreignKey({
            columns: [table.productId, table.categoryId],
            foreignColumns: [products.id, products.categoryId]
        }).onDelete("cascade"),
        uniqueVariantCategory: unique("unique_variant_category").on(table.id, table.categoryId)
    }
});

// 3g. Product Specification Values Table (PIM Data)
export const productSpecValues = pgTable("product_spec_values", {
    id: uuid("id").primaryKey().defaultRandom(),
    variantId: uuid("variant_id").notNull(),
    specId: uuid("spec_id").notNull(),
    categoryId: uuid("category_id").notNull(), // Denormalized for invariant enforcement
    valueString: text("value_string"),
    valueNumber: integer("value_number"),
    valueBoolean: boolean("value_boolean"),
}, (table) => {
    return {
        variantCategoryFk: foreignKey({
            columns: [table.variantId, table.categoryId],
            foreignColumns: [productVariants.id, productVariants.categoryId]
        }).onDelete("cascade"),
        specCategoryFk: foreignKey({
            columns: [table.specId, table.categoryId],
            foreignColumns: [specDefinitions.id, specDefinitions.categoryId]
        }).onDelete("cascade"),
        uniqueVariantSpec: unique("unique_variant_spec").on(table.variantId, table.specId)
    }
});

// 4. Cart Items Table
export const cartItems = pgTable("cart_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
    offerId: uuid("offer_id").references(() => sellerOffers.id, { onDelete: "cascade" }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        quantityCheck: check("cart_items_quantity_check", sql`quantity > 0`),
        userIdx: index("cart_items_user_idx").on(table.userId),
        offerIdx: index("cart_items_offer_idx").on(table.offerId)
    }
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
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }), // Keep record if product deleted
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

// 8b. Media Cleanup Jobs (Durable Storage Compensation)
export const mediaCleanupJobs = pgTable("media_cleanup_jobs", {
    id: uuid("id").primaryKey().defaultRandom(),
    storagePath: text("storage_path").notNull(),
    reason: text("reason").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    lastError: text("last_error"),
    status: text("status").default('pending').notNull(), // 'pending', 'completed', 'failed'
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

// 10. Quote Requests Table (B2B Procurement MVP)
export const quoteRequests = pgTable("quote_requests", {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteNumber: text("quote_number").notNull().unique(), // e.g. QR-2026-0001
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    status: text("status").notNull(), // 'NEW', 'REVIEWING', 'QUOTED', 'ACCEPTED', 'CLOSED'
    
    // Customer Snapshot
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    companyName: text("company_name"),
    
    // Shipping Snapshot
    shippingAddressLine1: text("shipping_address_line1").notNull(),
    shippingAddressLine2: text("shipping_address_line2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state").notNull(),
    shippingPincode: text("shipping_pincode").notNull(),
    
    notes: text("notes"),
    estimatedSubtotal: integer("estimated_subtotal").notNull(), // Minor units
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        subtotalCheck: check("quote_requests_subtotal_check", sql`estimated_subtotal >= 0`),
        userIdx: index("quote_requests_user_idx").on(table.userId)
    }
});

// 11. Quote Request Items Table
export const quoteRequestItems = pgTable("quote_request_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteRequestId: uuid("quote_request_id").references(() => quoteRequests.id, { onDelete: "cascade" }).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }), // Keep if product deleted
    offerId: uuid("offer_id").references(() => sellerOffers.id, { onDelete: "set null" }).notNull(), // Snapshot which seller offer was requested

    
    productNameSnapshot: text("product_name_snapshot").notNull(),
    priceSnapshot: integer("price_snapshot").notNull(), // Minor units
    quantity: integer("quantity").notNull(),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        quantityCheck: check("quote_request_items_quantity_check", sql`quantity > 0`),
        priceCheck: check("quote_request_items_price_check", sql`price_snapshot >= 0`)
    }
});

// 12. Seller Offers Table
export const sellerOffers = pgTable("seller_offers", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "cascade" }).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
    price: integer("price").notNull(), // Minor units (paise)
    moq: integer("moq").default(1).notNull(),
    leadTimeDays: integer("lead_time_days").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        uniqueOffer: unique("unique_seller_offer").on(table.sellerId, table.variantId),
        uniqueOfferSeller: unique("unique_offer_seller").on(table.id, table.sellerId),
        priceCheck: check("seller_offers_price_check", sql`price >= 0`),
        moqCheck: check("seller_offers_moq_check", sql`moq > 0`),
        sellerIdx: index("seller_offers_seller_idx").on(table.sellerId),
        variantIdx: index("seller_offers_variant_idx").on(table.variantId)
    }
});

// 13. Seller SKUs Table
export const sellerSkus = pgTable("seller_skus", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    offerId: uuid("offer_id").notNull(),
    skuCode: text("sku_code").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        offerSellerFk: foreignKey({
            columns: [table.offerId, table.sellerId],
            foreignColumns: [sellerOffers.id, sellerOffers.sellerId]
        }).onDelete("cascade"),
        uniqueSkuSeller: unique("unique_sku_seller").on(table.id, table.sellerId),
        uniqueSku: unique("unique_seller_sku").on(table.sellerId, table.skuCode)
    }
});

// 14. Inventory Locations Table
export const inventoryLocations = pgTable("inventory_locations", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => sellers.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    address: text("address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        uniqueLocationSeller: unique("unique_location_seller").on(table.id, table.sellerId)
    }
});

// 15. Inventory Items Table
export const inventoryItems = pgTable("inventory_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull(),
    locationId: uuid("location_id").notNull(),
    skuId: uuid("sku_id").notNull(),
    onHandQuantity: integer("on_hand_quantity").default(0).notNull(),
    reservedQuantity: integer("reserved_quantity").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        skuSellerFk: foreignKey({
            columns: [table.skuId, table.sellerId],
            foreignColumns: [sellerSkus.id, sellerSkus.sellerId]
        }).onDelete("cascade"),
        locationSellerFk: foreignKey({
            columns: [table.locationId, table.sellerId],
            foreignColumns: [inventoryLocations.id, inventoryLocations.sellerId]
        }).onDelete("cascade"),
        uniqueInventoryItem: unique("unique_inventory_item").on(table.locationId, table.skuId),
        onHandCheck: check("inventory_items_on_hand_check", sql`on_hand_quantity >= 0`),
        reservedCheck: check("inventory_items_reserved_check", sql`reserved_quantity >= 0`),
        sellableCheck: check("inventory_items_sellable_check", sql`reserved_quantity <= on_hand_quantity`),
        sellerIdx: index("inventory_items_seller_idx").on(table.sellerId),
        skuIdx: index("inventory_items_sku_idx").on(table.skuId),
        locationIdx: index("inventory_items_location_idx").on(table.locationId)
    }
});import { relations } from 'drizzle-orm';

export const categoriesRelations = relations(categories, ({ many }) => ({
  specDefinitions: many(specDefinitions),
  products: many(products),
}));

export const specDefinitionsRelations = relations(specDefinitions, ({ one }) => ({
  category: one(categories, {
    fields: [specDefinitions.categoryId],
    references: [categories.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  productVariants: many(productVariants),
  productMedia: many(productMedia),
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
  product: one(products, {
    fields: [productMedia.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  specValues: many(productSpecValues),
}));

export const productSpecValuesRelations = relations(productSpecValues, ({ one }) => ({
  variant: one(productVariants, {
    fields: [productSpecValues.variantId],
    references: [productVariants.id],
  }),
  specDefinition: one(specDefinitions, {
    fields: [productSpecValues.specId],
    references: [specDefinitions.id],
  }),
}));
