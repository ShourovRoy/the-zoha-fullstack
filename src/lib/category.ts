import 'server-only'
import { db } from '@/database/db'
import { categoryTable } from '@/database/schemas/category'
import { and, count, desc, ilike, SQL } from 'drizzle-orm'


export async function getAllCategories(categoryName?: string, currentPage: number = 0) {
  'use cache'

  const filters: SQL[] = []
  let offset: number = 0;

  if (categoryName) {
    console.log(categoryName)
    filters.push(ilike(categoryTable.name, categoryName))
  }

  if (currentPage > 0) {
    offset = (currentPage - 1) * 6
  }


  const [categories, categoriesCount] = await Promise.all([
    db.select().from(categoryTable).where(and(...filters)).limit(6).offset(offset).orderBy(desc(categoryTable.created_at)),
    db.select({ count: count() }).from(categoryTable).where(and(...filters))
  ])


  const totalPages = Math.ceil(Number(categoriesCount[0]?.count) / 6)
  console.log(totalPages)
  return {
    categories,
    totalPages
  }
}
