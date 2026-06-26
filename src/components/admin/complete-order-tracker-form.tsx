'use client'

import { completeOrderTracker } from "@/actions/admin/order-tracker-action"
import { useActionState, useEffect, useState } from "react"
import { ShieldCheck, AlertCircle, CheckCircle, Loader2, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"


const CompleteOrderTrackerForm = ({
    trackingOrderId
}: {
    trackingOrderId: string
}) => {
    const { refresh } = useRouter()
    const [state, action, loading] = useActionState(
        completeOrderTracker,
        undefined
    )
    const [isConfirm, setIsConfirm] = useState<boolean>(false)

    useEffect(() => {
        // Keeps your exact combined message confirmation logic to reset the safety toggle flag
        if (state?.errorMessage || state?.message) {
            setIsConfirm(false)
            refresh()

        }
    }, [state])

    return (
        <form
            action={action}
            className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
        >
            <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-800 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-stone-600" />
                    <span>Authorize & Close Node Pipeline</span>
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                    Enter the client-provided security confirmation key passcode to mark this delivery dispatch as completed.
                </p>
            </div>

            {/* ACTION RUNTIME RESPONSE STATE MESSAGES */}
            {(state?.errorMessage || state?.message || state?.errors) && (
                <div className="space-y-2">
                    {/* Global Server Actions Execution Failures */}
                    {state?.errorMessage && (
                        <div className="flex items-center gap-2 p-3 border border-red-100 bg-red-50/50 rounded-xl text-xs font-semibold text-red-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.errorMessage}</span>
                        </div>
                    )}

                    {/* Invalid OTP Input Fields Alerts */}
                    {state?.errors?.otpCode && (
                        <div className="flex items-center gap-2 p-3 border border-amber-100 bg-amber-50/50 rounded-xl text-xs font-semibold text-amber-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.errors.otpCode}</span>
                        </div>
                    )}

                    {/* Invalid Context Hook Identity Alerts */}
                    {state?.errors?.orderTrackingId && (
                        <div className="flex items-center gap-2 p-3 border border-red-100 bg-red-50/50 rounded-xl text-xs font-semibold text-red-700">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>Tracking ID Error: {state.errors.orderTrackingId}</span>
                        </div>
                    )}

                    {/* Action Execution Success Confirmation Block */}
                    {state?.message && (
                        <div className="flex items-center gap-2 p-3 border border-emerald-100 bg-emerald-50/50 rounded-xl text-xs font-semibold text-emerald-700">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{state.message}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden Input parameters metadata mappings */}
            <input type="hidden" name="orderTrackingId" defaultValue={trackingOrderId} />

            <div className="space-y-4">
                {/* OTP Code Input Field wrapper block */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="otpCode"
                        className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1"
                    >
                        <KeyRound className="h-3 w-3" /> Secure OTP Passcode
                    </label>
                    <input
                        type="text"
                        name="otpCode"
                        id="otpCode"
                        maxLength={4}
                        placeholder="0000"
                        disabled={loading}
                        className="w-full tracking-[0.25em] text-center text-sm font-mono font-bold text-stone-800 bg-stone-50 border border-stone-200 focus:border-stone-400 focus:bg-white placeholder:text-stone-300 outline-none rounded-xl px-3.5 py-2.5 transition-all disabled:opacity-50"
                    />
                </div>

                {/* Safety Confirmation Checkbox Element */}
                <label
                    htmlFor="confirm"
                    className="flex items-start gap-3 bg-stone-50/50 hover:bg-stone-50 border border-stone-200/60 rounded-xl p-3.5 transition-colors cursor-pointer select-none"
                >
                    <input
                        type="checkbox"
                        name="confirm"
                        id="confirm"
                        checked={isConfirm}
                        disabled={loading}
                        onChange={() => setIsConfirm(!isConfirm)}
                        className="h-4 w-4 rounded-md border-stone-300 text-stone-900 focus:ring-stone-900 shrink-0 mt-0.5 accent-stone-900 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-stone-800 block">Confirm hand-over handoff dispatch</span>
                        <span className="text-[11px] text-stone-400 font-medium leading-normal block">
                            I verify that the package has been physically checked out and handed over to the authorized party.
                        </span>
                    </div>
                </label>
            </div>

            {/* Interactive Dispatch Trigger Action Buttons */}
            <div className="pt-1">
                <button
                    type="submit"
                    disabled={!isConfirm || loading}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 border border-transparent disabled:border-stone-200/50 rounded-xl px-4 py-3 transition-all cursor-pointer shadow-2xs select-none"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Working on it...</span>
                        </>
                    ) : (
                        <span>Complete the tracking</span>
                    )}
                </button>
            </div>
        </form>
    )
}

export default CompleteOrderTrackerForm