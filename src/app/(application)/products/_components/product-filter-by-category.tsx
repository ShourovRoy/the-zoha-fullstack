'use client'

import { Category } from "@/database/schemas/category"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface FilterProps {
    categories: Category[]
}

const ProductFilterByCategory = ({ categories }: { categories: Category[] }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    const activeCategoryId = searchParams.get("categoryId")

    const handleFilter = (categoryId: string) => {
        const params = new URLSearchParams(searchParams)
        params.delete("page") // Reset page index when switching filters

        if (categoryId) {
            params.set("categoryId", categoryId)
        } else {
            params.delete("categoryId")
        }
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-3">
            {/* Minimal Header Actions Layout */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-700">
                    Categories
                </span>
                {activeCategoryId && (
                    <button
                        onClick={() => handleFilter("")}
                        className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Flat Text-Driven Interactive Navigation */}
            <div className="flex flex-col items-start space-y-2">
                {categories.map((category) => {
                    const isSelected = activeCategoryId === category.id

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleFilter(category.id)}
                            className={`text-xs text-left w-full transition-colors py-0.5 focus:outline-hidden ${isSelected
                                    ? "text-neutral-900 font-semibold"
                                    : "text-neutral-500 hover:text-neutral-900"
                                }`}
                        >
                            {category.name}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductFilterByCategory