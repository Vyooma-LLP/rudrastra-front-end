ALTER TABLE "products" ADD COLUMN "specifications" jsonb;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_check" CHECK (quantity > 0);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_price_check" CHECK (unit_price >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_price_check" CHECK (price >= 0);--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_stock_check" CHECK (stock_qty >= 0);