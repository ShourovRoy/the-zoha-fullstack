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
        })

    },


    orderTable: {
        orderItems: r.many.orderItemTable({
            from: r.orderTable.id,
            to: r.orderItemTable.id
        }),
        user: r.one.usersTable({
            from: r.orderTable.orderUserId,
            to: r.usersTable.id
        })
    },

    usersTable: {
        orders: r.many.orderTable({
            from: r.usersTable.id,
            to: r.orderTable.orderUserId
        })
    }


}));



