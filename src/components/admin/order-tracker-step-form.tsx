'use client'

import { addOrderTrackingStep } from "@/actions/admin/add-order-tracker-step-action"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useRef } from "react"
import { PlusCircle, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

interface ActionState {
    success?: boolean;
    message?: string;
    errorMessage?: string;
    errors?: {
        stepDesc?: string;
        orderTrackingId?: string;
    };
}

const OrderTrackerStepForm = ({ trackingId }: { trackingId: string }) => {
    // Declared ActionState generic configuration mapping to prevent TS engine type inference loops
    const [state, action, loading] = useActionState(
        addOrderTrackingStep,
        undefined
    )
    const { refresh } = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state?.message) {
            refresh()
            // Reset input fields automatically when a transaction completes successfully
            formRef.current?.reset()
        }
    }, [state, refresh])

    return (
        <form
            ref={formRef}
            action={action}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
        >
            <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-800 tracking-tight">
                    Log New Movement Event
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                    Append immediate geographic locations or process transitions onto this delivery log ticket.
                </p>
            </div>

            {/* ACTION RUNTIME RESPONSE STATE MESSAGES */}
            {(state?.errorMessage || state?.success !== undefined || state?.message || state?.errors) && (
                <div className="space-y-2">
                    {/* Global Execution Action Fault Banner */}
                    {state?.errorMessage && (
                        <div className="flex items-center gap-2 p-3 border border-red-100 bg-red-50/50 rounded-xl text-xs font-semibold text-red-700 animate-fade-in">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.errorMessage}</span>
                        </div>
                    )}

                    {/* Validation Field Error: Description Text */}
                    {state?.errors?.stepDesc && (
                        <div className="flex items-center gap-2 p-3 border border-amber-100 bg-amber-50/50 rounded-xl text-xs font-semibold text-amber-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.errors.stepDesc}</span>
                        </div>
                    )}

                    {/* Validation Field Error: Context Target ID */}
                    {state?.errors?.orderTrackingId && (
                        <div className="flex items-center gap-2 p-3 border border-red-100 bg-red-50/50 rounded-xl text-xs font-semibold text-red-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>Context Fault: {state.errors.orderTrackingId}</span>
                        </div>
                    )}

                    {/* State Success Message Notification Box */}
                    {state?.message && (
                        <div className="flex items-center gap-2 p-3 border border-emerald-100 bg-emerald-50/50 rounded-xl text-xs font-semibold text-emerald-700 animate-fade-in">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.message}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden tracking context reference point hooks */}
            <input type="hidden" name="orderTrackingId" defaultValue={trackingId} />

            <div className="space-y-1.5">
                <label
                    htmlFor="stepDesc"
                    className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block"
                >
                    Fulfillment Checkpoint Note
                </label>
                <input
                    type="text"
                    name="stepDesc"
                    id="stepDesc"
                    placeholder="e.g., Package has cleared clearing customs at central logistics dock..."
                    disabled={loading}
                    className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:bg-white placeholder:text-stone-300 outline-none rounded-xl px-3.5 py-2.5 transition-all disabled:opacity-50"
                />
            </div>

            {/* Submit Action Triggers */}
            <div className="flex justify-end pt-1">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 rounded-xl px-4 py-2.5 transition-colors cursor-pointer shadow-2xs select-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Appending Note...</span>
                        </>
                    ) : (
                        <>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Add New Step</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

export default OrderTrackerStepForm