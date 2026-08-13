ALTER TABLE "idempotency_keys" DROP CONSTRAINT "idempotency_keys_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "idempotency_keys" ADD COLUMN "request_hash" text;--> statement-breakpoint
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "unique_idempotency_key" UNIQUE("user_id","operation","idempotency_key");