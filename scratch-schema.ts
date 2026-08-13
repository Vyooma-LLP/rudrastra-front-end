import fs from 'fs';

let content = fs.readFileSync('src/db/schema.ts', 'utf-8');

// Add specifications to products table
if (!content.includes('specifications: jsonb("specifications")')) {
    content = content.replace(
        'imageUrl: text("image_url"),',
        'imageUrl: text("image_url"),\n    specifications: import("drizzle-orm/pg-core").jsonb("specifications"),'
    );
}

// Add check constraint to products table
if (!content.includes('check("products_price_check"')) {
    content = content.replace(
        'updatedAt: timestamp("updated_at").defaultNow().notNull(),\n});',
        `updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        priceCheck: import("drizzle-orm/pg-core").check("products_price_check", import("drizzle-orm").sql\`price >= 0\`),
        stockCheck: import("drizzle-orm/pg-core").check("products_stock_check", import("drizzle-orm").sql\`stock_qty >= 0\`)
    }
});`
    );
}

// Add check constraint to cartItems table
if (!content.includes('check("cart_items_quantity_check"')) {
    content = content.replace(
        'updatedAt: timestamp("updated_at").defaultNow().notNull(),\n}); // 5. Orders Table',
        `updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        quantityCheck: import("drizzle-orm/pg-core").check("cart_items_quantity_check", import("drizzle-orm").sql\`quantity > 0\`)
    }
});

// 5. Orders Table`
    );
}

// Add check constraint to orderItems table
if (!content.includes('check("order_items_quantity_check"')) {
    content = content.replace(
        'lineTotal: integer("line_total").notNull(), // Minor units\n});',
        `lineTotal: integer("line_total").notNull(), // Minor units
}, (table) => {
    return {
        quantityCheck: import("drizzle-orm/pg-core").check("order_items_quantity_check", import("drizzle-orm").sql\`quantity > 0\`),
        priceCheck: import("drizzle-orm/pg-core").check("order_items_price_check", import("drizzle-orm").sql\`unit_price >= 0\`)
    }
});`
    );
}

fs.writeFileSync('src/db/schema.ts', content);
