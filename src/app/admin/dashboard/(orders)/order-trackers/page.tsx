import { getAllActiveTracker } from "@/lib/data/order-tracker-data"
import { formatPriceInBdt } from "@/lib/helpers/currency-helper"
import { Calendar, User, Phone, MapPin, Package, AlertCircle, RefreshCw, Layers } from "lucide-react"
import Link from "next/link"

const OrderTrackersPage = async () => {
    const { errorMessage, orderTrackers } = await getAllActiveTracker()

    return (
        <div className="min-h-screen bg-stone-50/50 p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-stone-500" />
                        <span>Live Fulfillment Logs</span>
                    </h1>
                    <p className="text-xs text-stone-400 font-medium">
                        Monitor pipelines, shipping statuses, and track active client shipments.
                    </p>
                </div>
                <div className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs">
                    {orderTrackers?.length || 0} Tracking Nodes
                </div>
            </div>

            {/* 1. HANDLE ERROR MESSAGE STATE */}
            {errorMessage ? (
                <div className="text-center py-12 border border-red-200 bg-red-50/30 rounded-2xl max-w-md mx-auto space-y-3 p-6">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                    <h3 className="text-sm font-bold text-red-800">Tracking Matrix Unavailable</h3>
                    <p className="text-xs text-red-600/80 max-w-60 mx-auto leading-relaxed">{errorMessage}</p>
                </div>
            ) :

                /* 2. EMPTY CONTEXT GRID STATE */
                (!orderTrackers || orderTrackers.length === 0) ? (
                    <div className="text-center py-16 border border-dashed border-stone-200 bg-white rounded-2xl max-w-md mx-auto space-y-2">
                        <RefreshCw className="h-8 w-8 text-stone-300 mx-auto animate-spin [animation-duration:10s]" />
                        <h3 className="text-sm font-bold text-stone-800">No Tracks Initialized</h3>
                        <p className="text-xs text-stone-400 max-w-60 mx-auto">There are currently no active delivery logs running in the system pipeline.</p>
                    </div>
                ) : (

                    /* 3. ACTIVE RESPONSIVE TRACKING GRID LAYOUT */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orderTrackers.map((tracker, index) => {
                            const trackerKey = tracker.id || `tracker-${index}`
                            const clientName = tracker.order?.user?.firstName || "Guest Shopper"
                            const formattedDate = tracker.created_at
                                ? new Date(tracker.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "N/A"

                            return (
                                <Link href={`/admin/dashboard/order-trackers/${tracker.id}`} key={trackerKey} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-stone-300 transition-all">

                                    <div className="space-y-4">
                                        {/* Card Header Tracker Meta */}
                                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                                            {/* Tracking Log ID Section */}
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">TRACK LOG ID</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        title={tracker.id}
                                                        className="font-mono text-xs font-bold text-stone-900 select-all tracking-tight truncate block"
                                                    >
                                                        {tracker.id ? `${tracker.id.slice(0, 8)}...${tracker.id.slice(-4)}` : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Order Reference ID Section */}
                                            <div className="space-y-0.5 sm:text-right shrink-0 min-w-0">
                                                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">ORDER REF</span>
                                                <span
                                                    title={tracker.order?.id}
                                                    className="font-mono text-xs font-semibold text-stone-600 select-all block truncate max-w-[120px] sm:max-w-none"
                                                >
                                                    {tracker.order?.id ? `${tracker.order.id.slice(0, 8)}...${tracker.order.id.slice(-4)}` : "N/A"}
                                                </span>
                                            </div>

                                        </div>

                                        <hr className="border-stone-100" />

                                        {/* Core Data Presentation Metrics */}
                                        <div className="space-y-2.5 text-xs">
                                            {/* Client Name */}
                                            <div className="flex items-center gap-2 text-stone-600">
                                                <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                                <span className="font-medium truncate text-stone-800">{clientName}</span>
                                            </div>

                                            {/* Phone Connection Row */}
                                            <div className="flex items-center gap-2 text-stone-600">
                                                <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                                <span className="font-mono">{tracker.order?.contactNumber || "No Phone Registered"}</span>
                                            </div>

                                            {/* Delivery Location Destination Row */}
                                            <div className="flex items-start gap-2 text-stone-600">
                                                <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2 leading-relaxed text-stone-500">
                                                    {tracker.order?.shippingAddress || "No explicit delivery address notes provided."}
                                                </span>
                                            </div>

                                            {/* Step Node Timestamp */}
                                            <div className="flex items-center gap-2 text-stone-600">
                                                <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                                <span>Initialized on {formattedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial and Item Count Matrix Summary Row */}
                                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
                                            <Package className="h-3.5 w-3.5 text-stone-400" />
                                            <span>{tracker.order?.totalOrderItems || 0} Items</span>
                                        </div>

                                        {/* Localized BDT Ribbon pricing block with Indian numbering standard mapping */}
                                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-stone-900 bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-xl">
                                            <span>
                                                {formatPriceInBdt(tracker.order?.totalAmount?.toString()!)}
                                            </span>
                                        </div>
                                    </div>

                                </Link>
                            )
                        })}
                    </div>
                )}
        </div>
    )
}

export default OrderTrackersPage