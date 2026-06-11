import { db } from '@/database/db'
import { categoryTable } from '@/database/schemas/category'
import { and, ilike, SQL } from 'drizzle-orm'
import 'server-only'


export async function getAllCategories(categoryName?: string, currentPage?: number) {
    'use cache'

    const filters: SQL[] = []

    if (categoryName) {
        filters.push(ilike(categoryTable.name, categoryName))
    }

    const categories = await db.select().from(categoryTable).where(and(...filters))
    return categories
}