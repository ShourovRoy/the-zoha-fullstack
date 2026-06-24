import { getOrderDetails } from '@/lib/data/order-data'
import { getAssetUrl } from '@/lib/helpers/media'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft, Calendar, User, Phone, MapPin,
    CreditCard, Package, AlertTriangle,
    ShoppingBag, FileText
} from 'lucide-react'
import OrderActionForm from '@/components/admin/order-action-form'

const OrderDetails = async ({ params }: {
    params: Promise<{
        orderId: string
    }>
}) => {
    const { orderId } = await params
    const { errorMessage, orderDetails } = await getOrderDetails(orderId)

    // 1. Error Guard State Presentation
    if (errorMessage) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                    <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
                    <h2 className="text-sm font-bold text-red-900">Data Fetching Failed</h2>
                    <p className="text-xs text-red-600 font-medium leading-relaxed">{errorMessage}</p>
                    <Link
                        href="/admin/dashboard/orders"
                        className="inline-flex text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl px-4 py-2 transition-colors mt-2"
                    >
                        Back to Orders Queue
                    </Link>
                </div>
            </div>
        )
    }

    if (!orderDetails) return null

    const formattedDate = orderDetails.created_at
        ? new Date(orderDetails.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : "N/A"

    return (
        <div className="min-h-screen bg-stone-50/40 p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Context Navigation & Action Top Deck */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200 pb-5">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard/available-orders/"
                        className="p-2 border border-stone-200 bg-white text-stone-500 hover:text-stone-900 rounded-xl shadow-2xs transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-stone-900 tracking-tight">Invoice Details</h1>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${orderDetails.isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}>
                                {orderDetails.isCompleted ? "Fulfilled" : "Active Pool"}
                            </span>
                        </div>
                        <p className="text-xs font-mono text-stone-400 font-medium select-all uppercase tracking-tight">{orderDetails.id}</p>
                    </div>
                </div>

                {/* Status Gauges & Admin Operational Control Keys */}
                <div className="flex flex-wrap items-center gap-3 sm:self-start md:self-center">

                    {/* Context State Labels */}
                    <div className="flex items-center gap-1.5 border border-stone-200 bg-stone-100/60 p-1 rounded-xl">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${orderDetails.orderProcessStatus === "confirming"
                            ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                            : "bg-stone-900 text-white border-transparent"
                            }`}>
                            {orderDetails.orderProcessStatus}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${orderDetails.orderPaymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                            {orderDetails.orderPaymentStatus?.toUpperCase()}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-stone-200 hidden sm:block" />

                    {/* Client Side Action Pipeline Trigger Injection */}
                    <OrderActionForm orderProcessStatus={orderDetails.orderProcessStatus!} isCompleted={orderDetails.isCompleted!} orderId={orderDetails.id} />
                </div>
            </div>

            {/* Core Breakdown 2-Column Meta Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Area: Order Items Ledger Table (Takes 2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                            <Package className="h-4 w-4 text-stone-400" />
                            <span>Cart Items Line Breakdown ({orderDetails.totalOrderItems} units)</span>
                        </h2>

                        <div className="divide-y divide-stone-100 overflow-hidden">
                            {orderDetails.orderItems?.map((orderItem, index) => {
                                const itemKey = orderItem.id || `item-${index}`
                                const itemDate = orderItem.created_at
                                    ? new Date(orderItem.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                    : "N/A"

                                return (
                                    <div key={itemKey} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start justify-between">
                                        <div className="flex gap-3.5 items-start">
                                            {/* Media Frame Asset Container */}
                                            <div className="h-16 w-16 bg-stone-50 border border-stone-200 rounded-xl overflow-hidden relative shrink-0">
                                                <Image
                                                    src={getAssetUrl(orderItem?.featuredImageKey)}
                                                    fill
                                                    className="object-cover"
                                                    alt={orderItem.productName || "Product"}
                                                />
                                            </div>

                                            {/* Product Metadata Context */}
                                            <div className="space-y-1">
                                                <h4 className="text-xs font-bold text-stone-800 leading-snug line-clamp-1">{orderItem.productName}</h4>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-400 font-medium">
                                                    <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide">
                                                        {orderItem.categoryName || "General"}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-mono text-stone-400">ID: {orderItem.productId?.slice(0, 8)}...</span>
                                                    <span>•</span>
                                                    <span>Added {itemDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Metric Multiplier calculations */}
                                        <div className="text-right shrink-0 space-y-0.5">
                                            <div className="text-xs font-bold text-stone-900">
                                                {orderItem.totalPrice} <span className="text-[10px] text-stone-400 font-medium">BDT</span>
                                            </div>
                                            <div className="text-[11px] text-stone-400 font-mono font-medium">
                                                {orderItem.price} × {orderItem.quantity}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Operational Message Pipeline Logs */}
                    {orderDetails.orderPaymentMessage && (
                        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-stone-400" />
                                <span>Gateway Transaction Payload Log Context</span>
                            </h3>
                            <p className="text-xs font-medium text-stone-600 italic bg-stone-50/80 border border-stone-100 p-3 rounded-xl leading-relaxed">
                                &ldquo;{orderDetails.orderPaymentMessage}&rdquo;
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Area: Client Logistics & Transaction Summaries (Takes 1 Column) */}
                <div className="space-y-6">

                    {/* Customer Logistics Registry Metadata Card */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                            <User className="h-4 w-4 text-stone-400" />
                            <span>Customer Profile Ledger</span>
                        </h2>

                        <div className="space-y-3.5 text-xs">
                            <div className="flex gap-2.5 items-start">
                                <Phone className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-stone-400 font-medium block">Contact Identifier</span>
                                    <span className="font-mono text-stone-800 font-bold tracking-tight">{orderDetails.contactNumber || "Unregistered Number"}</span>
                                </div>
                            </div>

                            <div className="flex gap-2.5 items-start">
                                <MapPin className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-stone-400 font-medium block">Shipping Address Coordinates</span>
                                    <p className="text-stone-600 font-semibold leading-relaxed">{orderDetails.shippingAddress || "No explicit delivery address listed."}</p>
                                </div>
                            </div>

                            <div className="flex gap-2.5 items-start border-t border-stone-100 pt-3">
                                <Calendar className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-stone-400 font-medium block">Invoice Generation Timeline</span>
                                    <span className="text-stone-700 font-medium">{formattedDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Financial Statement Breakdown Card */}
                    <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShoppingBag className="h-24 w-24" />
                        </div>

                        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2 border-b border-stone-800 pb-3">
                            <CreditCard className="h-4 w-4 text-stone-400" />
                            <span>Financial Ledger Overview</span>
                        </h2>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between font-medium text-stone-400">
                                <span>Payment Router:</span>
                                <span className="text-stone-200 capitalize font-semibold">{orderDetails.orderPaymentChannel || "Direct Channel"}</span>
                            </div>
                            <div className="flex justify-between font-medium text-stone-400">
                                <span>Billing Instrument:</span>
                                <span className="text-stone-200 capitalize font-mono">{orderDetails.orderPaymentMethod?.replace(/_/g, " ") || "N/A"}</span>
                            </div>
                            <div className="flex justify-between font-medium text-stone-400 border-b border-stone-800 pb-2.5">
                                <span>Adjusted Deductions:</span>
                                <span className="text-red-400 font-mono font-bold">-{orderDetails.discount || "0.00"} BDT</span>
                            </div>

                            <div className="flex justify-between items-baseline pt-1.5">
                                <span className="text-stone-300 font-bold">Aggregate Total:</span>
                                <div className="text-xl font-black text-white tracking-tight">
                                    {orderDetails.totalAmount} <span className="text-xs font-bold text-stone-400">BDT</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default OrderDetails