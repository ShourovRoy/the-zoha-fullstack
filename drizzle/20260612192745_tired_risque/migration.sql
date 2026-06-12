CREATE TYPE "user_role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"desc" varchar(255) NOT NULL,
	"image_key" varchar(600) NOT NULL UNIQUE,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"image_key" varchar(1000) NOT NULL UNIQUE,
	"product_id" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(355) NOT NULL,
	"short_desc" varchar(500) NOT NULL,
	"price" numeric DEFAULT '0.00' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"threshold_quantity" integer DEFAULT 1,
	"desc" varchar(800),
	"featured_image_key" varchar(1100) NOT NULL,
	"category_id" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"phone_number" varchar(20) NOT NULL UNIQUE,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'customer'::"user_role" NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"default_shipping_address" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "productImages" ADD CONSTRAINT "productImages_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");