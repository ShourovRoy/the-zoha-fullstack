import { decimal, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";
import { categoryTable } from "./category";

export const productTable = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", {
    length: 355,
  }).notNull(),
  shortDesc: varchar("short_desc", {
    length: 500,
  }).notNull(),
  price: decimal().notNull().default("0.00"),
  desc: varchar("desc", {
    length: 800
  }),
  featuredImageKey: varchar("featured_image_key", {
    length: 1100
  }).notNull(),
  categoryId: uuid("category_id").references(() => categoryTable.id),
  ...timestamps,
})

export const productImageTable = pgTable("productImages", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageKey: varchar("image_key", {
    length: 1000
  }).notNull().unique(),
  productId: uuid("product_id").references(() => productTable.id),
  ...timestamps,
})

