import { db } from "@/database/db"
import { orderTable } from "@/database/schemas/order"
import { OrderJwtPayload, verifyToken } from "@/lib/helpers/jwt-helper"
import { and, eq } from "drizzle-orm"
import { XCircle, ShieldAlert, ArrowRight, RefreshCw, Calendar } from "lucide-react"
import Link from "next/link"

interface PageProps {
    searchParams: Promise<{
        redirectToken?: string
    }>
}

const CheckoutFailPage = async ({ searchParams }: PageProps) => {
    const { redirectToken } = await searchParams

    if (!redirectToken) {
        return <InvalidAccessView message="Access Denied: Missing cryptographic token context." />
    }

    const decodedPayload = await verifyToken<OrderJwtPayload>(redirectToken)

    if (!decodedPayload) {
        return <InvalidAccessView message="This verification link has expired or is invalid." isExpired />
    }

    const { orderId, userId } = decodedPayload

    if (!orderId || !userId) {
        return <InvalidAccessView message="Security Validation Failed: Malformed token payloads detected." />
    }

    // Fetch the detailed order schema mapping context
    const [orderDetails] = await db
        .select()
        .from(orderTable)
        .where(and(eq(orderTable.id, orderId), eq(orderTable.orderUserId, userId)))
        .limit(1)

    if (!orderDetails) {
        return <InvalidAccessView message="The requested order transaction record could not be found." />
    }

    const formattedDate = new Date(orderDetails.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50/40">
            <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6">

                {/* Header Failure Section */}
                <div className="text-center space-y-2">
                    <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                        <XCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                        <h1 className="text-stone-900 text-base font-bold tracking-tight">Payment Authorization Failed</h1>
                        <p className="text-xs text-stone-400">Your card issuer or banking gateway declined the transaction.</p>
                    </div>
                </div>

                {/* Metadata Meta Chips */}
                <div className="flex items-center justify-between gap-2 bg-stone-50/80 border border-stone-100 p-2.5 rounded-xl text-[11px] font-medium text-stone-500">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-stone-400" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="capitalize text-red-600 font-semibold">{orderDetails.orderProcessStatus || "Failed"}</span>
                    </div>
                </div>

                {/* Ledger Breakdown Receipt */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-stone-800 tracking-wider uppercase">Attempted Transaction Ledger</h3>
                    <div className="border border-stone-100 rounded-xl divide-y divide-stone-100 overflow-hidden text-xs">
                        <div className="flex justify-between p-3 bg-stone-50/30">
                            <span className="text-stone-400">Order Reference</span>
                            <span className="font-mono font-bold text-stone-900 select-all">{orderId}</span>
                        </div>
                        <div className="flex justify-between p-3">
                            <span className="text-stone-400">Payment Channel</span>
                            <span className="font-medium text-stone-700">{orderDetails.orderPaymentChannel || "Card Gateway"}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-stone-50/50 font-semibold text-stone-900 text-sm">
                            <span className="text-stone-500">Target Amount</span>
                            <span className="font-bold">{orderDetails.totalAmount} BDT</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Payment Failure Reason Message from SSLCommerz logs */}
                {orderDetails.orderPaymentMessage && (
                    <div className="text-[11px] text-center text-red-700 bg-red-50/30 py-2.5 px-3 rounded-xl border border-red-100/60 leading-relaxed font-medium">
                        Reason: &ldquo;{orderDetails.orderPaymentMessage}&rdquo;
                    </div>
                )}

                {/* Structural Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                        href="/checkout"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl py-2.5 hover:bg-stone-50 active:bg-stone-100 transition-colors shadow-2xs"
                    >
                        <RefreshCw className="h-3.5 w-3.5 text-stone-400" />
                        <span>Retry Checkout</span>
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-stone-900 rounded-xl py-2.5 hover:bg-stone-800 active:bg-stone-950 transition-all shadow-sm"
                    >
                        <span>View Products</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

// Reusable elegant warning breakout block
function InvalidAccessView({ message, isExpired = false }: { message: string, isExpired?: boolean }) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50/40">
            <div className="w-full max-w-sm text-center space-y-4 border border-red-100 bg-red-50/40 rounded-2xl p-6 backdrop-blur-sm">
                <ShieldAlert className="h-8 w-8 text-red-600 mx-auto animate-pulse" />
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-red-900">{isExpired ? "Validation Session Expired" : "Secure Protocol Violation"}</h2>
                    <p className="text-[11px] text-red-700/80 leading-relaxed max-w-70 mx-auto">{message}</p>
                </div>
                <Link
                    href="/application/dashboard"
                    className="inline-flex text-[11px] font-bold text-red-700 underline underline-offset-4 hover:text-red-900 transition-colors"
                >
                    Return to safe zone dashboard
                </Link>
            </div>
        </div>
    )
}

export default CheckoutFailPage