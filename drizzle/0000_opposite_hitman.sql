CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon_url" text
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"offer_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_quantity_check" CHECK (quantity > 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "feature_flag_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature_key" text NOT NULL,
	"old_state" boolean NOT NULL,
	"new_state" boolean NOT NULL,
	"changed_by" uuid,
	"reason" text,
	"environment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature_key" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"environment" text DEFAULT 'production' NOT NULL,
	"reason" text,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_feature_key_unique" UNIQUE("feature_key")
);
--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"operation" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"request_hash" text,
	"status" text NOT NULL,
	"response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "unique_idempotency_key" UNIQUE("user_id","operation","idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"on_hand_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_inventory_item" UNIQUE("location_id","sku_id"),
	CONSTRAINT "inventory_items_on_hand_check" CHECK (on_hand_quantity >= 0),
	CONSTRAINT "inventory_items_reserved_check" CHECK (reserved_quantity >= 0),
	CONSTRAINT "inventory_items_sellable_check" CHECK (reserved_quantity <= on_hand_quantity)
);
--> statement-breakpoint
CREATE TABLE "inventory_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location_seller" UNIQUE("id","seller_id")
);
--> statement-breakpoint
CREATE TABLE "manufacturer_badges" (
	"manufacturer_id" uuid NOT NULL,
	"badge_id" uuid NOT NULL,
	CONSTRAINT "unique_manufacturer_badge" UNIQUE("manufacturer_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"logo" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_cleanup_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_path" text NOT NULL,
	"reason" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"variant_id" uuid,
	"product_name_snapshot" text NOT NULL,
	"sku_snapshot" text,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" integer NOT NULL,
	CONSTRAINT "order_items_quantity_check" CHECK (quantity > 0),
	CONSTRAINT "order_items_price_check" CHECK (unit_price >= 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text NOT NULL,
	"subtotal" integer NOT NULL,
	"tax" integer NOT NULL,
	"total" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"shipping_name" text NOT NULL,
	"shipping_phone" text NOT NULL,
	"shipping_address_line1" text NOT NULL,
	"shipping_address_line2" text,
	"shipping_city" text NOT NULL,
	"shipping_state" text NOT NULL,
	"shipping_pincode" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"media_type" text DEFAULT 'image' NOT NULL,
	"asset_role" text DEFAULT 'general' NOT NULL,
	"sort_order" integer NOT NULL,
	"alt_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_product_sort_order" UNIQUE("product_id","sort_order"),
	CONSTRAINT "sort_order_check" CHECK (sort_order >= 0),
	CONSTRAINT "product_media_type_check" CHECK (media_type IN ('image', 'video', 'cad', 'document')),
	CONSTRAINT "product_media_asset_role_check" CHECK (asset_role IN ('datasheet', 'performance_data', 'test_report', 'certification', 'manual', 'drawing', 'general'))
);
--> statement-breakpoint
CREATE TABLE "product_spec_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"spec_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"value_string" text,
	"value_number" integer,
	"value_boolean" boolean,
	CONSTRAINT "unique_variant_spec" UNIQUE("variant_id","spec_id")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"canonical_sku" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_variant_category" UNIQUE("id","category_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" uuid,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"mpn" text,
	"normalized_mpn" text,
	"description" text,
	"image_url" text,
	"performance_data" jsonb,
	"cad_images" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "unique_catalog_identity" UNIQUE("manufacturer_id","normalized_mpn"),
	CONSTRAINT "unique_product_category" UNIQUE("id","category_id")
);
--> statement-breakpoint
CREATE TABLE "quote_request_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_request_id" uuid NOT NULL,
	"variant_id" uuid,
	"offer_id" uuid NOT NULL,
	"product_name_snapshot" text NOT NULL,
	"price_snapshot" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quote_request_items_quantity_check" CHECK (quantity > 0),
	CONSTRAINT "quote_request_items_price_check" CHECK (price_snapshot >= 0)
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_number" text NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company_name" text,
	"shipping_address_line1" text NOT NULL,
	"shipping_address_line2" text,
	"shipping_city" text NOT NULL,
	"shipping_state" text NOT NULL,
	"shipping_pincode" text NOT NULL,
	"notes" text,
	"estimated_subtotal" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quote_requests_quote_number_unique" UNIQUE("quote_number"),
	CONSTRAINT "quote_requests_subtotal_check" CHECK (estimated_subtotal >= 0)
);
--> statement-breakpoint
CREATE TABLE "seller_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"price" integer NOT NULL,
	"moq" integer DEFAULT 1 NOT NULL,
	"lead_time_days" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_seller_offer" UNIQUE("seller_id","variant_id"),
	CONSTRAINT "unique_offer_seller" UNIQUE("id","seller_id"),
	CONSTRAINT "seller_offers_price_check" CHECK (price >= 0),
	CONSTRAINT "seller_offers_moq_check" CHECK (moq > 0)
);
--> statement-breakpoint
CREATE TABLE "seller_skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"offer_id" uuid NOT NULL,
	"sku_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_sku_seller" UNIQUE("id","seller_id"),
	CONSTRAINT "unique_seller_sku" UNIQUE("seller_id","sku_code")
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spec_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"data_type" text NOT NULL,
	"unit" text,
	"is_required" boolean DEFAULT false NOT NULL,
	CONSTRAINT "unique_category_spec_def" UNIQUE("id","category_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"company_name" text,
	"gstin" text,
	"phone" text,
	"address_line1" text,
	"address_line2" text,
	"city" text,
	"state" text,
	"pincode" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_offer_id_seller_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."seller_offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flag_audit" ADD CONSTRAINT "feature_flag_audit_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_sku_id_seller_id_seller_skus_id_seller_id_fk" FOREIGN KEY ("sku_id","seller_id") REFERENCES "public"."seller_skus"("id","seller_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_location_id_seller_id_inventory_locations_id_seller_id_fk" FOREIGN KEY ("location_id","seller_id") REFERENCES "public"."inventory_locations"("id","seller_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_badges" ADD CONSTRAINT "manufacturer_badges_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_badges" ADD CONSTRAINT "manufacturer_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_spec_values" ADD CONSTRAINT "product_spec_values_variant_id_category_id_product_variants_id_category_id_fk" FOREIGN KEY ("variant_id","category_id") REFERENCES "public"."product_variants"("id","category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_spec_values" ADD CONSTRAINT "product_spec_values_spec_id_category_id_spec_definitions_id_category_id_fk" FOREIGN KEY ("spec_id","category_id") REFERENCES "public"."spec_definitions"("id","category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_category_id_products_id_category_id_fk" FOREIGN KEY ("product_id","category_id") REFERENCES "public"."products"("id","category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_request_items" ADD CONSTRAINT "quote_request_items_quote_request_id_quote_requests_id_fk" FOREIGN KEY ("quote_request_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_request_items" ADD CONSTRAINT "quote_request_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_request_items" ADD CONSTRAINT "quote_request_items_offer_id_seller_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."seller_offers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_offers" ADD CONSTRAINT "seller_offers_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_offers" ADD CONSTRAINT "seller_offers_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seller_skus" ADD CONSTRAINT "seller_skus_offer_id_seller_id_seller_offers_id_seller_id_fk" FOREIGN KEY ("offer_id","seller_id") REFERENCES "public"."seller_offers"("id","seller_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spec_definitions" ADD CONSTRAINT "spec_definitions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_items_user_idx" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cart_items_offer_idx" ON "cart_items" USING btree ("offer_id");--> statement-breakpoint
CREATE INDEX "inventory_items_seller_idx" ON "inventory_items" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "inventory_items_sku_idx" ON "inventory_items" USING btree ("sku_id");--> statement-breakpoint
CREATE INDEX "inventory_items_location_idx" ON "inventory_items" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "product_media_product_idx" ON "product_media" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "quote_requests_user_idx" ON "quote_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "seller_offers_seller_idx" ON "seller_offers" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "seller_offers_variant_idx" ON "seller_offers" USING btree ("variant_id");