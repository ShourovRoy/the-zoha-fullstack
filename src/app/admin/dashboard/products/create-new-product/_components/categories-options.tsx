'use server'

import { getAllCategories } from "@/lib/data/category-data"

export const CategoriesOptions = async () => {
    const { categories } = await getAllCategories()

    return (
        <>
            {categories.map((category, index) => (
                <option
                    key={category.id || index}
                    value={category.id}
                    className="text-neutral-900 bg-white py-1"
                >
                    {category.name.toLocaleUpperCase()}
                </option>
            ))}
        </>
    )
}