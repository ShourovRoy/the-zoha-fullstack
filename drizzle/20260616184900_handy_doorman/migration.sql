CREATE TYPE "order_payment_method" AS ENUM('cash_on_delivery', 'ssl_commerze_gateway');--> statement-breakpoint
CREATE TYPE "order_payment_status" AS ENUM('paid', 'due');--> statement-breakpoint
CREATE TYPE "order_process_status" AS ENUM('confirming', 'processing', 'confirmed');--> statement-breakpoint
CREATE TABLE "orderItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid,
	"order_id" uuid,
	"product_id" uuid,
	"product_name" varchar(500) NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"featured_image_key" varchar(1100) NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL,
	"total_price" numeric NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_user_id" uuid,
	"total_amount" numeric DEFAULT '0.00',
	"discount" numeric DEFAULT '0.00',
	"total_order_items" numeric DEFAULT '0',
	"order_payment_status" "order_payment_status" DEFAULT 'due'::"order_payment_status" NOT NULL,
	"order_payment_method" "order_payment_method",
	"order_payment_channel" varchar(200),
	"order_process_status" "order_process_status" DEFAULT 'confirming'::"order_process_status",
	"is_completed" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_user_id_users_id_fkey" FOREIGN KEY ("order_user_id") REFERENCES "users"("id");