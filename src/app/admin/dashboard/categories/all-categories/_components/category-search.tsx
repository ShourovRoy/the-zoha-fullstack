'use client'

import { useDebouncedCallback } from 'use-debounce';
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const CategorySearch = () => {

  const searchParams = useSearchParams();
  const pathname = usePathname()
  const { replace } = useRouter()

  
  const handleSearch = useDebouncedCallback((term:string) => {
    const params = new URLSearchParams(searchParams)
  
    if (term) {
      params.set("categoryName", term)
    } else {
      params.delete('categoryName')
    }
  
    replace(`${pathname}?${params.toString()}`)

  }, 300)
  return (
    <div className="relative max-w-md w-full mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <input
        type="text"
        name="searchCategory"
        id="searchCategory"
        defaultValue={searchParams.get("categoryName")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value)
         
        }}
        placeholder="Search catalog categories..."
        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
      />
    </div>
  )
}

export default CategorySearch