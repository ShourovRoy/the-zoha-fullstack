import 'server-only'
import { db } from '@/database/db'
import { productTable } from '@/database/schemas/product'
import { and, count, eq, gt, gte, ilike, lt, lte, sql, SQL } from 'drizzle-orm'
import { cacheLife, cacheTag, updateTag } from 'next/cache'


export async function getAllProducts(productName?: string, currentPage: number = 0, categoryId?: string, minPrice?: number, maxPrice?: number) {
    "use cache"
    cacheTag("productInventory")

    cacheLife('hours')

    const filtes: SQL[] = []
    let offset: number = 0

    if (productName) {
        filtes.push(ilike(productTable.name, productName))
    }

    if (categoryId) {
        filtes.push(eq(productTable.categoryId, categoryId))
    }

    if (minPrice) {
        filtes.push(gte(productTable.price, String(minPrice)))
    }

    if (maxPrice) {
        filtes.push(lte(productTable.price, String(maxPrice)))
    }




    if (currentPage > 0) {
        offset = (currentPage - 1) * 6
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
                } : undefined,
                categoryId: categoryId ? {
                    eq: categoryId
                } : undefined,
                price: {
                    gte: minPrice ? String(minPrice) : undefined,
                    lte: maxPrice ? String(maxPrice) : undefined
                }
            },
            offset: offset,
            limit: 6,
            orderBy: {
                created_at: "desc"
            }
        }),
        db.select({ count: count() }).from(productTable).where(and(...filtes))
    ])

    const totalPages = Math.ceil(Number(totalProductsCount[0].count) / 6)




    return {
        products,
        totalPages
    }
}


// get product details
export async function getProductDetails(slug: string) {
    'use cache'

    cacheTag(`productSlug-${slug}`)
    cacheLife("hours")

    try {
        const productsRes = await db.query.productTable.findFirst({
            with: {
                category: true, galleryImages: true
            },
            where: {
                slug: {
                    eq: slug
                }
            },

        })

        if (!productsRes) {
            return {
                errorMessage: "404 NOT FOUND!"
            }
        }

        return {
            productDetails: productsRes
        }

    } catch (error) {
        return {
            errorMessage: "Something went wrong!"
        }
    }

}

//  get max and min price of products
export async function getProductPriceBoundaries() {
    try {
        const [result] = await db
            .select({
                // sql<number>`...` tells TypeScript to expect a numeric return value
                lowestPrice: sql<number>`cast(min(${productTable.price}) as float)`,
                highestPrice: sql<number>`cast(max(${productTable.price}) as float)`,
            })
            .from(productTable);

        return {
            minPrice: result?.lowestPrice ?? 0,
            maxPrice: result?.highestPrice ?? 100, // Safe design system fallback
        };
    } catch (error) {
        console.error("Failed to fetch price boundaries:", error);
        return { minPrice: 0, maxPrice: 100 };
    }
}