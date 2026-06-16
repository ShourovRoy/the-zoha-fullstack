import { boolean, decimal, integer, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";
import { usersTable } from "./user";
import { productTable } from "./product";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const orderPaymentStatusEnum = pgEnum("order_payment_status", [
    "paid",
    "due",
]);


export const orderPaymentMethodEnum = pgEnum("order_payment_method", [
    "cash_on_delivery",
    "ssl_commerze_gateway",
]);

export const orderProcessStatusEnum = pgEnum("order_process_status", [
    "confirming",
    "processing",
    "confirmed",
]);

export const orderTable = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderUserId: uuid("order_user_id").references(() => usersTable.id),
    totalAmount: decimal("total_amount").default("0.00"),
    discount: decimal("discount").default("0.00"),
    totalOrderItems: integer("total_order_items").default(0),
    orderPaymentStatus: orderPaymentStatusEnum("order_payment_status").notNull().default("due"),
    orderPaymentMethod: orderPaymentMethodEnum("order_payment_method"),
    orderPaymentChannel: varchar("order_payment_channel", {
        length: 200
    }),
    orderProcessStatus: orderProcessStatusEnum("order_process_status").default("confirming"),
    isCompleted: boolean("is_completed").default(false),
    ...timestamps,
})

export const orderItemTable = pgTable("orderItems", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").references(() => usersTable.id, {
        onDelete: "cascade"
    }),
    orderId: uuid("order_id").references(() => orderTable.id, {
        onDelete: "cascade",
    }),
    productId: uuid("product_id").references(() => productTable.id, {
        onDelete: "no action",
    }),
    productName: varchar("product_name", {
        length: 500
    }).notNull(),
    categoryName: varchar("category_name", { length: 255 }).notNull(),
    featuredImageKey: varchar("featured_image_key", { length: 1100 }).notNull(),
    quantity: integer("quantity").notNull(),
    price: decimal("price").notNull(),
    totalPrice: decimal("total_price").notNull(),
    ...timestamps,
})



// export select and insert type
export type Order = InferSelectModel<typeof orderTable>

export type OrderInsert = InferInsertModel<typeof orderTable>

export type OrderItem = InferSelectModel<typeof orderItemTable>

export type OrderItemInsert = InferInsertModel<typeof orderItemTable>