'use client'

import { addRemoveCart } from "@/actions/cart/add-or-remove-cart-action"
import { Plus, Loader2, Minus } from "lucide-react"
import { useState, useEffect } from "react"

interface CartDecrementButtonProps {
    productId: string;
    cartId: string;
    currentQuantity: number
}

const CartDecrementButton = ({ productId, cartId, currentQuantity }: CartDecrementButtonProps) => {
    const [state, setState] = useState<{
        message: string | null
        errorMessage: string | null
        isLoading: boolean
    }>({
        message: null,
        errorMessage: null,
        isLoading: false
    })

    // Auto-clear error messages after 3 seconds so the UI cleans itself up
    useEffect(() => {
        if (state.errorMessage || state.message) {
            const timer = setTimeout(() => {
                setState(prev => ({ ...prev, message: null, errorMessage: null }))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [state.errorMessage, state.message])

    const decrementAction = async () => {
        setState(prev => ({ ...prev, isLoading: true, errorMessage: null, message: null }))

        try {
            const res = await addRemoveCart({
                actionType: currentQuantity === 1 ? "removeFromCart" : "decrement",
                productId: productId,
                cartId: cartId,
                quantity: 1
            })

            if (res?.message) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    message: res.message,
                    errorMessage: null
                }))
            } else if (res?.errorMessage) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    message: null,
                    errorMessage: res.errorMessage
                }))
            } else {
                setState(prev => ({ ...prev, isLoading: false }))
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                message: null,
                errorMessage: "Network error"
            }))
        }
    }

    return (
        <div className="relative flex items-center gap-1.5">
            {/* The Plus Increment Trigger Button */}
            <button
                onClick={decrementAction}
                disabled={state.isLoading}
                className={`p-1 rounded-md transition-all flex items-center justify-center h-6 w-6 relative focus:outline-hidden ${state.errorMessage
                    ? 'text-red-600 bg-red-50 border border-red-200'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white border border-transparent active:scale-95 disabled:opacity-50'
                    }`}
                title={state.errorMessage || state.message || "Increase Quantity"}
            >
                {state.isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-stone-900" />
                ) : (
                    <Minus className="h-3 w-3" />
                )}
            </button>

            {/* Micro Contextual Error Notice Popup */}
            {state.errorMessage && (
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-xs animate-in fade-in slide-in-from-bottom-1 duration-150 z-10">
                    {state.errorMessage}
                </span>
            )}
        </div>
    )
}

export default CartDecrementButton