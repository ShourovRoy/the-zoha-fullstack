import OrderTrackerStepForm from "@/components/admin/order-tracker-step-form"
import { getOrderTrackerDetails } from "@/lib/data/order-tracker-data"
import { Calendar, Package, AlertCircle, Layers, CheckCircle2, CircleDot, Clock, Hash, Coins } from "lucide-react"

const OrderTrackingPage = async ({
    params
}: {
    params: Promise<{
        orderTrackerId: string
    }>
}) => {
    const { orderTrackerId } = await params
    const { errorMessage, orderTracker } = await getOrderTrackerDetails(orderTrackerId, true)

    return (
        <div className="min-h-screen bg-stone-50/50 p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-stone-500" />
                        <span>Fulfillment Log Matrix</span>
                    </h1>
                    <p className="text-xs text-stone-400 font-medium">
                        Monitor checkpoints, order metadata, and dispatch updates to the customer lane.
                    </p>
                </div>

                {/* Pipeline Status Pill Accent */}
                <div className="shrink-0">
                    {orderTracker?.isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Fully Dispatched</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
                            <CircleDot className="h-3.5 w-3.5 animate-pulse" />
                            <span>In Transit Pipeline</span>
                        </span>
                    )}
                </div>
            </div>

            {/* ERROR BOUNDARY EXCEPTION ALERT BANNER */}
            {errorMessage && (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50/40 rounded-xl max-w-2xl mx-auto">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-red-800">Pipeline Sync Error</h4>
                        <p className="text-xs text-red-600/90 leading-relaxed">{errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Column Stack: Timeline Checklist + Actions */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Timeline Wrapper Card */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
                        <h3 className="text-sm font-bold text-stone-800 tracking-tight border-b border-stone-100 pb-3">
                            Milestone History Tracks
                        </h3>

                        {!orderTracker?.steps || orderTracker.steps.length === 0 ? (
                            <div className="text-center py-12 border border-dashed border-stone-100 bg-stone-50/30 rounded-xl space-y-2">
                                <Clock className="h-6 w-6 text-stone-300 mx-auto" />
                                <h4 className="text-xs font-bold text-stone-700">No Checkpoints Recorded</h4>
                                <p className="text-xs text-stone-400 max-w-xs mx-auto">This fulfillment node has been initialized. No movement transitions have been logged yet.</p>
                            </div>
                        ) : (
                            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
                                {orderTracker?.steps?.map((step, index) => {
                                    const isLatestStep = index === orderTracker.steps!.length - 1
                                    return (
                                        <div key={index} className="relative group flex items-start justify-between gap-4">
                                            {/* Timeline Circle Bullet Node */}
                                            <div className={`absolute left-[-21px] top-1.5 h-3 w-3 rounded-full border-2 bg-white transition-colors ${isLatestStep ? "border-stone-900 scale-110 shadow-xs" : "border-stone-200"
                                                }`} />

                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className={`text-xs leading-relaxed ${isLatestStep ? "font-semibold text-stone-900" : "text-stone-600"}`}>
                                                    {step}
                                                </p>
                                                <span className="text-[10px] font-medium text-stone-400 font-mono tracking-tight block">
                                                    Checkpoint Block #{index + 1}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Interactive Step Insertion Input Card */}
                    <OrderTrackerStepForm trackingId={orderTrackerId} />
                </div>

                {/* Right Column Stack: Context Metadata Panels */}
                <div className="space-y-4">
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-stone-800 tracking-tight border-b border-stone-100 pb-3">
                            Reference Identifiers
                        </h3>

                        <div className="space-y-4 text-xs">
                            {/* Tracker Identity Target Block */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider uppercase flex items-center gap-1">
                                    <Hash className="h-3 w-3" /> TRACK LOG ID
                                </span>
                                <span className="font-mono font-bold text-stone-900 select-all tracking-tight block truncate bg-stone-50 border border-stone-200/50 rounded-xl px-3 py-2">
                                    {orderTracker?.id || "N/A"}
                                </span>
                            </div>

                            {/* Order Identity Target Block */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold text-stone-400 tracking-wider uppercase flex items-center gap-1">
                                    <Hash className="h-3 w-3" /> ORDER REF ID
                                </span>
                                <span className="font-mono font-bold text-stone-600 select-all tracking-tight block truncate bg-stone-50 border border-stone-200/50 rounded-xl px-3 py-2">
                                    {orderTracker?.orderId || "N/A"}
                                </span>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Financial Summary Breakdown Cards */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-stone-50/60 border border-stone-200/40 p-3 rounded-xl space-y-1">
                                    <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">Gross Items</span>
                                    <span className="font-semibold text-stone-800 font-mono flex items-center gap-1">
                                        <Package className="h-3.5 w-3.5 text-stone-400" />
                                        {orderTracker?.order?.totalOrderItems || 0} units
                                    </span>
                                </div>
                                <div className="bg-stone-50/60 border border-stone-200/40 p-3 rounded-xl space-y-1">
                                    <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">Total Value</span>
                                    <span className="font-mono font-bold text-stone-900 flex items-center gap-0.5">
                                        <Coins className="h-3.5 w-3.5 text-stone-400" />
                                        {orderTracker?.order?.totalAmount || 0}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Native Temporal Tracking Milestones info lines */}
                            <div className="space-y-2.5 pt-0.5">
                                <div className="flex items-center justify-between text-stone-600">
                                    <span className="flex items-center gap-1.5 text-stone-400">
                                        <Calendar className="h-3.5 w-3.5 text-stone-400/80" />
                                        Tracker Setup:
                                    </span>
                                    <span className="font-mono text-[11px] font-semibold text-stone-800">
                                        {orderTracker?.created_at ? orderTracker.created_at.toDateString() : "N/A"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-stone-600">
                                    <span className="flex items-center gap-1.5 text-stone-400">
                                        <Calendar className="h-3.5 w-3.5 text-stone-400/80" />
                                        Order Initiated:
                                    </span>
                                    <span className="font-mono text-[11px] font-semibold text-stone-800">
                                        {orderTracker?.order?.created_at ? orderTracker.order.created_at.toDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderTrackingPage