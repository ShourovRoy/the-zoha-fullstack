import { db } from '@/database/db'
import { cacheLife, cacheTag } from 'next/cache'
import 'server-only'


export async function getAllProducts() {
    "use cache"
    cacheTag("productInventory")

    cacheLife('hours')

    const products = await db.query.productTable.findMany({
        with: {
            category: true,
            galleryImages: true
        }
    })


    return products
}