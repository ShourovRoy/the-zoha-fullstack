'use client'

import { useState } from "react"
import { MapPin, CheckCircle2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface ShippingFormProps {
    defaultAddress?: string | null
}

const ShippingForm = ({ defaultAddress }: ShippingFormProps) => {
    const [shippingAddress, setShippingAddress] = useState<string>(defaultAddress ?? "")
    const [isSaved, setIsSaved] = useState(false)

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    const params = new URLSearchParams(searchParams)


    const handleShippingAddressInSearchParams = useDebouncedCallback((term: string) => {
        if (term) {
            params.set("shippingAddress", term)
        } else {
            params.delete("shippingAddress")
        }

        replace(`${pathname}?${params}`)
    }, 300)



    const handleAutoSave = (value: string) => {
        setShippingAddress(value)
        handleShippingAddressInSearchParams(value)
        // Mock auto-save interaction state feedback
        if (value.length > 5) {
            setIsSaved(true)
        } else {
            setIsSaved(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-stone-200/50 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-stone-400" />
                    <span>Shipping Destination</span>
                </h2>
                {isSaved && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm animate-in fade-in duration-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Address Validated</span>
                    </span>
                )}
            </div>

            <hr className="border-stone-100" />

            <form onSubmit={(e) => e.preventDefault()} className="space-y-1.5">
                <label
                    htmlFor="shippingAddress"
                    className="text-[10px] font-bold tracking-wider uppercase text-stone-400"
                >
                    Street Address / Delivery Notes
                </label>
                <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => handleAutoSave(e.target.value)}
                    placeholder="Enter your accurate home, apartment, or office delivery address specifications..."
                    className="w-full text-xs font-medium bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-3.5 py-3 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-all resize-none placeholder:text-stone-400 leading-relaxed"
                />
            </form>
        </div>
    )
}

export default ShippingForm