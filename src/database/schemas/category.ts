
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";

export const categoryTable = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", {
        length: 100
    }).notNull(),
    desc: varchar("desc", {
        length: 255
    }).notNull(),
    imageKey: varchar("image_key", {
        length: 600
    }).notNull().unique(),
    ...timestamps,
})