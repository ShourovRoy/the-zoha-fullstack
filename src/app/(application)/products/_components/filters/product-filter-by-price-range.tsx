'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const ProductFilterByPriceRange = ({ minPrice, maxPrice }: {
    maxPrice: number
    minPrice: number
}) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    const [inputMinPriceValue, setInputMinPriceValue] = useState<number>(minPrice)
    const [inputMaxPriceValue, setInputMaxPriceValue] = useState<number>(maxPrice)

    const params = new URLSearchParams(searchParams)

    const handleMinAmountChange = (amount: number) => {
        if (amount) {
            setInputMinPriceValue(amount)
            params.set("minPrice", amount.toString())
        }
        replace(`${pathname}?${params}`)
    }

    const handleMaxAmountChange = (amount: number) => {
        if (amount) {
            setInputMaxPriceValue(amount)
            params.set("maxPrice", amount.toString())
        }
        replace(`${pathname}?${params}`)
    }

    const resetPriceRangeFilter = () => {
        params.delete("maxPrice")
        params.delete("minPrice")

        setInputMaxPriceValue(maxPrice)
        setInputMinPriceValue(minPrice)

        replace(`${pathname}?${params}`)
    }

    return (
        <div className="space-y-3">
            {/* Minimal Header Actions Layout */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-neutral-700">
                    Price Range
                </span>
                {(params.get("maxPrice") || params.get("minPrice")) && (
                    <button
                        onClick={resetPriceRangeFilter}
                        className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-hidden"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Twin Flat Inputs Row Layout */}
            <div className="flex items-center gap-2">
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 select-none">
                        ৳
                    </span>
                    <input
                        value={inputMinPriceValue}
                        onChange={(e) => handleMinAmountChange(Number(e.target.value))}
                        type="number"
                        name="minAmount"
                        id="minAmount"
                        className="w-full bg-white text-xs font-medium text-neutral-900 pl-7 pr-3 py-1.5 rounded-lg border border-neutral-200/60 focus:outline-hidden focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <span className="text-neutral-300 text-xs shrink-0 select-none">—</span>

                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400 select-none">
                        ৳
                    </span>
                    <input
                        value={inputMaxPriceValue}
                        onChange={(e) => handleMaxAmountChange(Number(e.target.value))}
                        type="number"
                        name="maxAmount"
                        id="maxAmount"
                        className="w-full bg-white text-xs font-medium text-neutral-900 pl-7 pr-3 py-1.5 rounded-lg border border-neutral-200/60 focus:outline-hidden focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductFilterByPriceRange