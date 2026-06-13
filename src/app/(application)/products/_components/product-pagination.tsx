'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function ProductPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    const params = new URLSearchParams(searchParams)
    const currentPage = Number(searchParams.get("page")) || 1

    const handlePaginationClick = (selectedPage: number) => {
        if (selectedPage > 1) {
            params.set("page", selectedPage.toString())
        } else {
            params.delete("page")
        }
        replace(`${pathname}?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    // Pure Math Window Engine (Strict maximum width of 4 indexes)
    const getVisiblePages = () => {
        const maxVisible = 4

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        let startPage = currentPage - 1

        if (startPage < 1) {
            startPage = 1
        } else if (startPage + maxVisible - 1 > totalPages) {
            startPage = totalPages - maxVisible + 1
        }

        return Array.from({ length: maxVisible }, (_, i) => startPage + i)
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 bg-white px-4 py-3 sm:px-6 mt-8 rounded-md shadow-xs">

            {/* Contextual Status Tracker Descriptor */}
            <div className="text-sm text-neutral-700 w-full sm:w-auto text-center sm:text-left">
                Showing page <span className="font-semibold text-neutral-900">{currentPage}</span> of{" "}
                <span className="font-semibold text-neutral-900">{totalPages}</span> pages
            </div>

            {/* Unified Pagination Row (Identical structure for both Desktop & Mobile scales) */}
            <div className="w-full sm:w-auto flex justify-center">
                <nav className="isolate inline-flex -space-x-px rounded-md bg-white shadow-2xs" aria-label="Pagination">

                    {/* Previous Arrow Navigation Trigger */}
                    <button
                        onClick={() => handlePaginationClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        type="button"
                        className="relative inline-flex items-center rounded-l-md px-2.5 py-2 text-neutral-400 border border-neutral-300 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </button>

                    {/* Dynamic 4-Button Number Run Layout */}
                    {visiblePages.map((pageNum) => {
                        const isActive = currentPage === pageNum

                        return (
                            <button
                                onClick={() => handlePaginationClick(pageNum)}
                                key={`page-${pageNum}`}
                                type="button"
                                aria-current={isActive ? "page" : undefined}
                                className={`relative inline-flex items-center px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${isActive
                                    ? "z-10 bg-amber-500 text-white border-amber-500"
                                    : "text-neutral-900 border-neutral-300 hover:bg-neutral-50"
                                    }`}
                            >
                                {pageNum}
                            </button>
                        )
                    })}

                    {/* Next Arrow Navigation Trigger */}
                    <button
                        onClick={() => handlePaginationClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        type="button"
                        className="relative inline-flex items-center rounded-r-md px-2.5 py-2 text-neutral-400 border border-neutral-300 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>

        </div>
    )
}