import { db } from '@/database/db'
import { productTable } from '@/database/schemas/product'
import { and, count, ilike, SQL } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import 'server-only'


export async function getAllProducts(productName?: string, currentPage: number = 0) {
    "use cache"
    cacheTag("productInventory")

    cacheLife('hours')

    const filtes: SQL[] = []

    if (productName) {
        filtes.push(ilike(productTable.name, productName))
    }

    const [products, totalProductsCount] = await Promise.all([
        db.query.productTable.findMany({
            with: {
                category: true,
                galleryImages: true
            },
            where: {
                name: productName ? {
                    ilike: `%${productName}%`
                } : undefined
            },
            offset: 0,
            limit: 2

        }),
        db.select({ count: count() }).from(productTable).where(and(...filtes))
    ])

    const totalPages = Math.ceil(Number(totalProductsCount[0].count) / 2)




    return {
        products,
        totalPages
    }
}