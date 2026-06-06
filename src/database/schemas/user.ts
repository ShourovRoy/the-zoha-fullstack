import {
    boolean,
    pgEnum,
    pgTable,
    text,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers";

export const userRoleEnum = pgEnum("user_role", [
    "admin",
    "customer",
]);

export const usersTable = pgTable("users", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    firstName: varchar("first_name", { length: 100 })
        .notNull(),

    lastName: varchar("last_name", { length: 100 })
        .notNull(),

    email: varchar("email", { length: 255 })
        .notNull()
        .unique(),

    phoneNumber: varchar("phone_number", { length: 20 })
        .notNull()
        .unique(),

    password: text("password")
        .notNull(),

    role: userRoleEnum("role")
        .notNull()
        .default("customer"),

    isEmailVerified: boolean("is_email_verified")
        .notNull()
        .default(false),

    defaultShippingAddress: text("default_shipping_address"),

    ...timestamps
});
