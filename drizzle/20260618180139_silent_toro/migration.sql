CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid UNIQUE,
	"transaction_id" varchar(500) NOT NULL UNIQUE,
	"card_issuer_country" varchar(255),
	"card_no" varchar(100),
	"card_type" varchar(255),
	"card_issuer" varchar(255),
	"currency" varchar(100),
	"amount" varchar(255),
	"store_amount" varchar(255),
	"bank_tran_id" varchar(1000),
	"gateway_status" varchar(50),
	"gateway_transaction_date" varchar(300),
	"is_validation_checked" boolean DEFAULT false,
	"validation_id" varchar(600) UNIQUE,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id");