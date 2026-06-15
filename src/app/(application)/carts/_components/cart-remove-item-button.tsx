'use client'

import { addRemoveCart } from "@/actions/cart/add-or-remove-cart-action"
import { Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface CartRemoveItemButtonProps {
    productId: string;
    cartId: string;

}

const CartRemoveItemButton = ({ productId, cartId }: CartRemoveItemButtonProps) => {
    const [state, setState] = useState<{
        message: string | null
        errorMessage: string | null
        isLoading: boolean
    }>({
        message: null,
        errorMessage: null,
        isLoading: false
    })

    // Auto-clear error or success alerts safely after 3 seconds
    useEffect(() => {
        if (state.errorMessage || state.message) {
            const timer = setTimeout(() => {
                setState(prev => ({ ...prev, message: null, errorMessage: null }))
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [state.errorMessage, state.message])

    const deleteAction = async () => {
        setState(prev => ({ ...prev, isLoading: true, errorMessage: null, message: null }))

        try {
            const res = await addRemoveCart({
                actionType: "removeFromCart",
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
        <div className="relative flex items-center justify-center">
            <button
                onClick={deleteAction}
                disabled={state.isLoading}
                className={`p-2 rounded-xl transition-all flex items-center justify-center h-8 w-8 relative focus:outline-hidden border border-transparent ${state.errorMessage
                    ? 'text-red-600 bg-red-50 border-red-200'
                    : 'text-stone-400 hover:text-red-600 hover:bg-red-50/50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                title={state.errorMessage || state.message || "Remove item from cart"}
            >
                {state.isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-red-600" />
                ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                )}
            </button>

            {/* Contextual Error Notice Tooltip */}
            {state.errorMessage && (
                <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap shadow-xs animate-in fade-in slide-in-from-bottom-1 duration-150 z-10">
                    {state.errorMessage}
                </span>
            )}
        </div>
    )
}

export default CartRemoveItemButton