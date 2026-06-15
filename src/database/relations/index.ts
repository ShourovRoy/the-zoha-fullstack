import * as schema from "@/database/relations/schema"
import { defineRelations, defineRelationsPart } from 'drizzle-orm';


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
    }




}));



