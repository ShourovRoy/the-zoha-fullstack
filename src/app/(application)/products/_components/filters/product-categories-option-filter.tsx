'use server'

import { getAllCategories } from "@/lib/data/category-data"
import ProductFilterByCategory from "./product-filter-by-category"

const ProductCategoriesOptionFilter = async () => {
    const { categories } = await getAllCategories()

    return <ProductFilterByCategory categories={categories} />
}

export default ProductCategoriesOptionFilter