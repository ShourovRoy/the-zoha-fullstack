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
    let offset: number = 0

    if (productName) {
        filtes.push(ilike(productTable.name, productName))
    }

    if (currentPage > 0) {
        offset = (currentPage - 1) * 5
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
            offset: offset,
            limit: 5,
            orderBy: {
                created_at: "desc"
            }
        }),
        db.select({ count: count() }).from(productTable).where(and(...filtes))
    ])

    const totalPages = Math.ceil(Number(totalProductsCount[0].count) / 5)




    return {
        products,
        totalPages
    }
}