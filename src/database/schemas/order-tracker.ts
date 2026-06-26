import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";
import { orderTable } from "./order";



// order tracker table
export const orderTrackerTable = pgTable("ordertracker", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orderTable.id, {
        onDelete: "set null",
    }).unique(),
    otpCode: varchar("otp_code", { length: 10 }),
    isCompleted: boolean("is_completed").default(false),
    steps: varchar("steps").array(),
    ...timestamps
})