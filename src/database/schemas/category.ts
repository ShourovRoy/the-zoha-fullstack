import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";



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

// Type for selecting data (read operations)
export type Category = InferSelectModel<typeof categoryTable>;

// Type for inserting data (write operations)
export type NewCategory = InferInsertModel<typeof categoryTable>;
