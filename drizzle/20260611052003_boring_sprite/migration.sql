CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"desc" varchar(255) NOT NULL,
	"image_key" varchar(600) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_image_key_unique" UNIQUE("image_key")
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "deleted_at";