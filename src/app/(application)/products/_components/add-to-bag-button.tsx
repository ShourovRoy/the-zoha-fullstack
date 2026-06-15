'use client'

import { addRemoveCart } from '@/actions/cart/add-or-remove-cart-action'
import { ShoppingBag, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AddToBagButtonProps {
    isOutOfStock: boolean
    productId: string
}

const AddToBagButton = ({ isOutOfStock, productId }: AddToBagButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState<{
        type: "success" | "error" | null
        text: string | null
    }>({ type: null, text: null })

    // Auto-clear notification state after 3 seconds
    useEffect(() => {
        if (feedback.text) {
            const timer = setTimeout(() => {
                setFeedback({ type: null, text: null })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [feedback.text])

    const cartAction = async () => {
        if (isLoading || isOutOfStock) return

        setIsLoading(true)
        setFeedback({ type: null, text: null })

        try {
            const res = await addRemoveCart({
                actionType: "addToCart",
                productId,
                cartId: undefined, // Handled automatically by session/cookie on server side
                quantity: 1
            })

            if (res?.errorMessage) {
                setFeedback({
                    type: "error",
                    text: res.errorMessage
                })
            } else if (res?.message) {
                setFeedback({
                    type: "success",
                    text: res.message || "Added to bag"
                })
            }
        } catch (error) {
            setFeedback({
                type: "error",
                text: "Failed to update bag"
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Determine current look based on state states
    const getButtonStyles = () => {
        if (isOutOfStock) return "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/50"
        if (feedback.type === "success") return "bg-emerald-600 text-white border border-emerald-700"
        if (feedback.type === "error") return "bg-red-50 text-red-600 border border-red-200"
        return "bg-stone-900 hover:bg-stone-800 text-white border border-transparent active:scale-[0.99]"
    }

    return (
        <div className="w-full relative col-span-3">
            <button
                onClick={cartAction}
                disabled={isOutOfStock || isLoading}
                className={`w-full py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 relative overflow-hidden focus:outline-hidden ${getButtonStyles()}`}
            >
                {/* 1. Loading State Context */}
                {isLoading && (
                    <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Processing...</span>
                    </>
                )}

                {/* 2. Success Feedback Frame Overlay */}
                {!isLoading && feedback.type === "success" && (
                    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{feedback.text}</span>
                    </div>
                )}

                {/* 3. Standard / Base Button Content */}
                {!isLoading && feedback.type !== "success" && (
                    <>
                        <ShoppingBag className={`h-3.5 w-3.5 ${feedback.type === "error" ? "text-red-500" : ""}`} />
                        <span>{isOutOfStock ? "Out of Stock" : "Add to Bag"}</span>
                    </>
                )}
            </button>

            {/* Micro Floating Toast Alert for Errors Only (Keeps layout clean) */}
            {feedback.type === "error" && feedback.text && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-medium py-1 px-2.5 rounded-lg flex items-center gap-1.5 shadow-md whitespace-nowrap z-20 animate-in fade-in slide-in-from-bottom-1 duration-150">
                    <AlertCircle className="h-3 w-3 text-red-400 shrink-0" />
                    <span>{feedback.text}</span>
                </div>
            )}
        </div>
    )
}

export default AddToBagButton