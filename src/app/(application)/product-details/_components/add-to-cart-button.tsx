'use client'

import { addRemoveCart } from "@/actions/cart/add-or-remove-cart-action";
import { ShoppingBag, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface AddToCartBtnProps {
    productId: string;
    cartId?: string;
    userId: string;
    quantity: number;
    actionType: "addToCart" | "removeFromCart" | "increment" | "decrement";
    isOutOfStock: boolean;
}

const AddToCartBtn = ({
    productId,
    cartId,
    userId,
    quantity,
    actionType,
    isOutOfStock
}: AddToCartBtnProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error" | null;
        text: string | null;
    }>({ type: null, text: null });

    // Auto-clear notification banner text after 4 seconds
    useEffect(() => {
        if (feedback.text) {
            const timer = setTimeout(() => {
                setFeedback({ type: null, text: null });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [feedback.text]);

    const cartAction = async () => {
        if (isLoading || isOutOfStock) return;

        setIsLoading(true);
        setFeedback({ type: null, text: null });

        try {
            const res = await addRemoveCart({
                userId,
                actionType,
                productId,
                cartId,
                quantity
            });

            if (res?.errorMessage) {
                setFeedback({
                    type: "error",
                    text: res.errorMessage
                });
            } else if (res?.message) {
                setFeedback({
                    type: "success",
                    text: res.message
                });
            }
        } catch (error) {
            setFeedback({
                type: "error",
                text: "Something went wrong. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-3">
            {/* Primary Action Button Element */}
            <button
                onClick={cartAction}
                disabled={isOutOfStock || isLoading}
                className={`w-full py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] select-none ${isOutOfStock
                    ? "bg-stone-100 text-stone-400 border border-stone-200/50 cursor-not-allowed"
                    : isLoading
                        ? "bg-stone-800 text-stone-300 cursor-wait"
                        : "bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md"
                    }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-stone-400" />
                        <span>Updating Bag...</span>
                    </>
                ) : (
                    <>
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        <span>{isOutOfStock ? "স্টক শেষ (Unavailable)" : "Add to Shopping Bag"}</span>
                    </>
                )}
            </button>

            {/* Micro-Copy Inline System Messages */}
            {feedback.text && (
                <div
                    className={`flex items-center gap-2 text-[11px] px-3 py-2 rounded-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${feedback.type === "success"
                        ? "bg-emerald-50/60 border-emerald-100 text-emerald-700"
                        : "bg-red-50/60 border-red-100 text-red-700"
                        }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                    )}
                    <span className="font-medium">{feedback.text}</span>
                </div>
            )}
        </div>
    );
};

export default AddToCartBtn;