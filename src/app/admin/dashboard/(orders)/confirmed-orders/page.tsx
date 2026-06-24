import { getAllConfirmedInCompleteOrders, getAllConfirmingInCompleteAvailableOrders } from "@/lib/data/order-data"
import { ShoppingBag, Calendar, User, Phone, MapPin, Eye, DollarSign, Package } from "lucide-react"
import Link from "next/link"

const ConfirmedOrdersPage = async () => {
    // const { orders } = await getAllConfirmingInCompleteAvailableOrders()
    const { orders } = await getAllConfirmedInCompleteOrders()

    return (
        <div className="min-h-screen bg-stone-50/50 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-stone-500" />
                        <span>Confirmed  Orders</span>
                    </h1>
                    <p className="text-xs text-stone-400 font-medium">
                        Manage, review, and advance newly initialized or unfulfilled client queues.
                    </p>
                </div>
                <div className="bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs">
                    {orders?.length || 0} To Complete 
                </div>
            </div>

            {/* Empty Context Grid State */}
            {!orders || orders.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-stone-200 bg-white rounded-2xl max-w-md mx-auto space-y-2">
                    <Package className="h-8 w-8 text-stone-300 mx-auto" />
                    <h3 className="text-sm font-bold text-stone-800">No Orders Queue</h3>
                    <p className="text-xs text-stone-400 max-w-60 mx-auto">There are currently no new or incoming orders awaiting confirmation details.</p>
                </div>
            ) : (
                /* Active Content Orders Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order, index) => {
                        const orderKey = order.id || `order-${index}`
                        const clientName = order.user
                            ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                            : "Guest Shopper"

                        const formattedDate = order.created_at
                            ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "N/A"

                        return (
                            <div key={orderKey} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-stone-300 transition-all">

                                <div className="space-y-4">
                                    {/* Card Header Topline metadata */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">REF CODE</span>
                                            <span className="font-mono text-xs font-bold text-stone-900 select-all tracking-tight break-all">
                                                {order.id}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                                            {/* Process Status Pill Accent */}
                                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border ${order.orderProcessStatus === "confirming"
                                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                                : "bg-stone-50 text-stone-600 border-stone-200"
                                                }`}>
                                                {order.orderProcessStatus || "Pending"}
                                            </span>
                                            {/* Payment Status Pill Accent */}
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${order.orderPaymentStatus === "paid"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-red-50/60 text-red-700"
                                                }`}>
                                                {order.orderPaymentStatus === "paid" ? "Paid" : "Due"}
                                            </span>
                                        </div>
                                    </div>

                                    <hr className="border-stone-100" />

                                    {/* Core Data Presentation Metrics */}
                                    <div className="space-y-2.5 text-xs">
                                        {/* Client Name Details Row */}
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <User className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                            <span className="font-medium truncate text-stone-800">{clientName}</span>
                                        </div>

                                        {/* Contact Number Phone Row */}
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <Phone className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                            <span className="font-mono">{order.contactNumber || "No Phone Registered"}</span>
                                        </div>

                                        {/* Shipping Location Address Row */}
                                        <div className="flex items-start gap-2 text-stone-600">
                                            <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                                            <span className="line-clamp-2 leading-relaxed text-stone-500">{order.shippingAddress || "No explicit delivery address notes provided."}</span>
                                        </div>

                                        {/* Order Timestamp Processing Row */}
                                        <div className="flex items-center gap-2 text-stone-600">
                                            <Calendar className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                                            <span>Placed on {formattedDate}</span>
                                        </div>
                                    </div>

                                    {/* Operational System Context Field Logs */}
                                    {(order.orderPaymentMessage || order.orderPaymentMethod) && (
                                        <div className="bg-stone-50/60 border border-stone-100 rounded-xl p-2.5 text-[11px] space-y-1">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-stone-400">Method via:</span>
                                                <span className="text-stone-700 capitalize font-semibold">{order.orderPaymentMethod?.replace(/_/g, " ") || "N/A"}</span>
                                            </div>
                                            {order.orderPaymentMessage && (
                                                <p className="text-stone-400 italic leading-snug line-clamp-1 border-t border-stone-200/40 pt-1 mt-1">
                                                    &ldquo;{order.orderPaymentMessage}&rdquo;
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Action and Quantity aggregation matrix lines */}
                                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
                                        <Package className="h-3.5 w-3.5 text-stone-400" />
                                        <span>{order.totalOrderItems || 0} Products</span>
                                    </div>

                                    <Link
                                        href={`/admin/dashboard/order-details/${order.id}/`}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 hover:bg-stone-100 hover:text-stone-900 rounded-xl px-3 py-2 transition-colors cursor-pointer"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>View Details</span>
                                    </Link>
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ConfirmedOrdersPage