import { boolean, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { productTable } from "./product";
import { timestamps } from "../helpers/columns.helpers";

export const cartTable = pgTable("carts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => usersTable.id),
    productId: uuid("product_id").references(() => productTable.id),
    quantity: integer("quantity").default(1),
    // isCompleted: boolean("is_completed").default(false),
    ...timestamps,
})