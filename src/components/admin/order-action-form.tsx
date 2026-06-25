'use client'

import { completeAdminOrder, updateAdminOrder } from "@/actions/admin/update-order-action"
import { OrderProcessStatusType } from "@/database/schemas/order"
import { Check, X, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

const OrderActionForm = ({ orderId, isCompleted, orderProcessStatus }: { orderId: string, isCompleted: boolean, orderProcessStatus: OrderProcessStatusType }) => {
    const { refresh } = useRouter()
    const [isPending, startTransition] = useTransition()
    const [activeAction, setActiveAction] = useState<"confirm" | "cancel" | null>(null)

    const [updateRes, setUpdateRes] = useState<{
        message: string | null
        errorMessage: string | null
    }>({
        message: null,
        errorMessage: null,
    })

    const handleOrderUpdate = (actionType: "confirmed" | "cancelled") => {
        setActiveAction(actionType === "confirmed" ? "confirm" : "cancel")
        setUpdateRes({ message: null, errorMessage: null })

        startTransition(async () => {
            const res = await updateAdminOrder({
                orderId,
                action: actionType
            })

            if (res?.errorMessage) {
                setUpdateRes({ errorMessage: res.errorMessage, message: null })
            } else if (res?.message) {
                setUpdateRes({ errorMessage: null, message: res.message })
            }

            refresh()
            setActiveAction(null)
        })
    }


    const handleCompleteOrder = () => {

        setUpdateRes({ message: null, errorMessage: null })

        startTransition(async () => {
            const res = await completeAdminOrder({
                orderId,

            })

            if (res?.errorMessage) {
                setUpdateRes({ errorMessage: res.errorMessage, message: null })
            } else if (res?.message) {
                setUpdateRes({ errorMessage: null, message: res.message })
            }

            refresh()
            setActiveAction(null)
        })
    }


    if (isCompleted || orderProcessStatus === "cancelled") return null

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Inline Micro Toast Pipeline Message Logs */}
            {updateRes.errorMessage && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{updateRes.errorMessage}</span>
                </div>
            )}

            {updateRes.message && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>{updateRes.message}</span>
                </div>
            )}

            <div className="flex items-center gap-2">
                {/* Cancel Button */}
                <button
                    onClick={() => handleOrderUpdate("cancelled")}
                    disabled={isPending}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-red-700 bg-white hover:bg-red-50/50 border border-stone-200 hover:border-red-200 px-3 py-1.5 rounded-xl shadow-3xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                    {isPending && activeAction === "cancel" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <X className="h-3.5 w-3.5" />
                    )}
                    <span>Cancel Order</span>
                </button>

                {/* Confirm Button */}
                {orderProcessStatus !== "confirmed" && (
                    <button
                        onClick={() => handleOrderUpdate("confirmed")}
                        disabled={isPending}
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 border border-transparent px-3.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {isPending && activeAction === "confirm" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Check className="h-3.5 w-3.5" />
                        )}
                        <span>Confirm Order</span>
                    </button>
                )}

                {!isCompleted && orderProcessStatus === "confirmed" && (
                    <div>
                        <button
                            onClick={() => handleCompleteOrder()}
                            disabled={isPending}
                            type="button"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-stone-800 border border-transparent px-3.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                            {isPending && activeAction === "confirm" ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Check className="h-3.5 w-3.5" />
                            )}
                            <span>Complete Order</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderActionForm