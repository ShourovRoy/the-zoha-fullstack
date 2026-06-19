'use client'

import { useState } from "react"
import { MapPin, CheckCircle2, Phone } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface ShippingFormProps {
    defaultAddress?: string | null,
    defaultContactNumber?: string | null
}

const ShippingForm = ({ defaultAddress, defaultContactNumber }: ShippingFormProps) => {
    const [shippingAddress, setShippingAddress] = useState<string>(defaultAddress ?? "")
    const [contactNumber, setContactNumber] = useState<string>(defaultContactNumber ?? "")
    const [isSaved, setIsSaved] = useState(false)

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    // Debounced URL updates for Shipping Address
    const handleShippingAddressInSearchParams = useDebouncedCallback((term: string) => {
        const currentParams = new URLSearchParams(searchParams.toString())
        if (term) {
            currentParams.set("shippingAddress", term)
        } else {
            currentParams.delete("shippingAddress")
        }
        replace(`${pathname}?${currentParams.toString()}`)
    }, 300)

    // Debounced URL updates for Contact Number
    const handleContactNumberInSearchParams = useDebouncedCallback((term: string) => {
        const currentParams = new URLSearchParams(searchParams.toString())
        if (term) {
            currentParams.set("contactNumber", term)
        } else {
            currentParams.delete("contactNumber")
        }
        replace(`${pathname}?${currentParams.toString()}`)
    }, 300)

    // Form Change Handlers
    const handleShippingAddressAutoSave = (value: string) => {
        setShippingAddress(value)
        handleShippingAddressInSearchParams(value)

        // Mock state sync logic validator
        if (value.length > 5 && contactNumber.length >= 11) {
            setIsSaved(true)
        } else {
            setIsSaved(false)
        }
    }

    const handleContactNumberAutoSave = (value: string) => {
        setContactNumber(value)
        handleContactNumberInSearchParams(value)

        // Mock state sync logic validator (e.g. valid BD/International numbers)
        if (shippingAddress.length > 5 && value.length >= 11) {
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
                        <span>Information Saved</span>
                    </span>
                )}
            </div>

            <hr className="border-stone-100" />

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Shipping Address Textarea */}
                <div className="flex flex-col space-y-1.5">
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
                        onChange={(e) => handleShippingAddressAutoSave(e.target.value)}
                        placeholder="Enter your accurate home, apartment, or office delivery address specifications..."
                        className="w-full text-xs font-medium bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-3.5 py-3 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-all resize-none placeholder:text-stone-400 leading-relaxed"
                    />
                </div>

                {/* Contact Number Input Field */}
                <div className="flex flex-col space-y-1.5">
                    <label
                        htmlFor="phoneNumber"
                        className="text-[10px] font-bold tracking-wider uppercase text-stone-400 flex items-center gap-1"
                    >
                        <Phone className="h-3 w-3 text-stone-400" />
                        <span>Contact Phone Number</span>
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={contactNumber}
                        onChange={(e) => handleContactNumberAutoSave(e.target.value)}
                        placeholder="e.g. +880 17XX XXXXXX"
                        className="w-full text-xs font-medium bg-stone-50 border border-stone-200 text-stone-800 rounded-xl px-3.5 py-3 focus:outline-hidden focus:border-stone-400 focus:bg-white transition-all placeholder:text-stone-400"
                    />
                </div>
            </form>
        </div>
    )
}

export default ShippingForm