import * as schema from "@/database/relations/schema"
import { defineRelations } from 'drizzle-orm';


export const relations = defineRelations(schema, (r) => ({
    // category table relation
    categoryTable: {
        products: r.many.productTable({
            from: r.categoryTable.id,
            to: r.productTable.categoryId
        }),
    },

    // product table relation
    productTable: {
        category: r.one.categoryTable({
            from: r.productTable.categoryId,
            to: r.categoryTable.id
        }),
        galleryImages: r.many.productImageTable({
            from: r.productTable.id,
            to: r.productImageTable.productId
        })
    },

    // product Image gallary relation

    productImageTable: {
        product: r.one.productTable({
            from: r.productImageTable.productId,
            to: r.productTable.id
        })
    },


    // cart product relation
    cartTable: {
        products: r.one.productTable({
            from: r.cartTable.productId,
            to: r.productTable.id,
        }),
        user: r.one.usersTable({
            from: r.cartTable.userId,
            to: r.usersTable.id
        })

    },


    orderTable: {
        orderItems: r.many.orderItemTable({
            from: r.orderTable.id,
            to: r.orderItemTable.orderId
        }),
        user: r.one.usersTable({
            from: r.orderTable.orderUserId,
            to: r.usersTable.id
        })
    },

    orderItemTable: {
        orderDetails: r.one.orderTable({
            from: r.orderItemTable.orderId,
            to: r.orderTable.id
        }),
        user: r.one.usersTable({
            from: r.orderItemTable.userId,
            to: r.usersTable.id
        })
    },

    usersTable: {
        orders: r.many.orderTable({
            from: r.usersTable.id,
            to: r.orderTable.orderUserId
        }),
        carts: r.many.cartTable({
            from: r.usersTable.id,
            to: r.cartTable.userId,
        })
    },

    transactionTable: {
        order: r.one.orderTable({
            from: r.transactionTable.orderId,
            to: r.orderTable.id
        })
    }


}));



