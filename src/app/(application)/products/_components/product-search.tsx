'use client'

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Search } from "lucide-react"

const ProductSearch = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const params = new URLSearchParams(searchParams)

    const handleSearch = useDebouncedCallback((term: string) => {
        // Reset page bounds back to start when typing an alternate query term
        params.delete("page")

        if (term) {
            params.set("productName", term)
        } else {
            params.delete("productName")
        }
        replace(`${pathname}?${params}`)
    }, 300)

    return (
        <div className="relative w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
                type="search"
                name="search"
                id="search"
                defaultValue={searchParams.get("productName")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={params.get("categoryId") ? "Search by selected category" : "Search catalog assets..."}
                className="w-full border border-neutral-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
        </div>
    )
}

export default ProductSearch