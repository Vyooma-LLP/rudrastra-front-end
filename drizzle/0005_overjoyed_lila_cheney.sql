ALTER TABLE "orders" ADD COLUMN "shipping_name" text DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_phone" text DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line1" text DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address_line2" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" text DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_state" text DEFAULT 'N/A' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_pincode" text DEFAULT 'N/A' NOT NULL;