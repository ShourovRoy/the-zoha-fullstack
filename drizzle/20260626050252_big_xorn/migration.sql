CREATE TABLE "ordertracker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid UNIQUE,
	"is_completed" boolean DEFAULT false,
	"steps" varchar[],
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ordertracker" ADD CONSTRAINT "ordertracker_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL;