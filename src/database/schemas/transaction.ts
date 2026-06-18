import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { orderTable } from "./order";
import { timestamps } from "../helpers/columns.helpers";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";



export const transactionTable = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orderTable.id, {
        onDelete: "set null"
    }).unique(),
    transactionId: varchar("transaction_id", {
        length: 500
    }).unique().notNull(),
    cardIssuerCountry: varchar("card_issuer_country", {
        length: 255
    }),
    cardNo: varchar("card_no", {
        length: 100
    }),
    cardType: varchar("card_type", {
        length: 255
    }),
    cardIssuer: varchar("card_issuer", {
        length: 255
    }),

    currency: varchar("currency", {
        length: 100
    }),

    amount: varchar("amount", {
        length: 255
    }),

    storeAmount: varchar("store_amount", {
        length: 255
    }),

    bankTranId: varchar("bank_tran_id", {
        length: 1000
    }),

    gatewayStatus: varchar("gateway_status", {
        length: 50
    }),

    gatewayTransactionDate: varchar("gateway_transaction_date", {
        length: 300
    }),

    isValidationChecked: boolean("is_validation_checked").default(false),

    validation_id: varchar("validation_id", {
        length: 600
    }).unique(),

    ...timestamps,

})


export type TransactionType = InferSelectModel<typeof transactionTable>

export type TransactionValueType = InferInsertModel<typeof transactionTable>