import ShippingForm from "@/components/checkout/forms/shipping-form"
import { getCheckOutCarts } from "@/lib/data/checkout-data"
import { getAssetUrl } from "@/lib/helpers/media"
import Image from "next/image"
import { ShoppingBag, Receipt, CreditCard, ArrowRight, Package } from "lucide-react"
import SelectOrderPaymentMethodButton from "./_components/select-order-payment-method-button"

const CheckoutPage = async () => {
    const { cartItems, totalOrderItems, totalPrice, userDetails } = await getCheckOutCarts()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('bn-BD', {
            style: 'currency', currency: 'BDT', minimumFractionDigits: 0
        }).format(amount)
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="px-4 py-16 text-center max-w-sm mx-auto">
                <div className="h-12 w-12 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                    <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-stone-900">Your bag is empty</h2>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    Add some products to your shopping bag before attempting to initiate checkout.
                </p>
            </div>
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 md:py-10">
            {/* Split Grid Parent - Content flips naturally to stacking on smaller dimensions */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

                {/* LEFT MAIN BAR: Inputs and Item verification stacks */}
                <div className="w-full lg:col-span-7 xl:col-span-8 space-y-6">

                    {/* 1. Address Form Container Block */}
                    <ShippingForm defaultAddress={userDetails?.defaultShippingAddress} />

                    {/* 2. Cart Items Review Panel List */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2 px-1">
                            <Package className="h-3.5 w-3.5" />
                            <span>Review Items In Bag ({totalOrderItems})</span>
                        </h3>

                        <div className="bg-white rounded-2xl border border-stone-200/50 shadow-xs divide-y divide-stone-100 overflow-hidden">
                            {cartItems.map((cartItem, index) => {
                                const itemPrice = parseFloat(cartItem.products?.price || "0")
                                const itemQty = cartItem.quantity || 1
                                const itemRowTotal = itemPrice * itemQty

                                return (
                                    <div
                                        key={cartItem.id || index}
                                        className="p-4 sm:p-5 flex items-start gap-4 text-xs transition-colors hover:bg-stone-50/40"
                                    >
                                        {/* Product Thumbnail Frame */}
                                        <div className="h-16 w-16 relative bg-stone-50 rounded-xl overflow-hidden border border-stone-100 shrink-0">
                                            <Image
                                                src={getAssetUrl(cartItem.products?.featuredImageKey!)}
                                                fill
                                                className="object-cover"
                                                alt={cartItem.products?.name || "Product image"}
                                                sizes="64px"
                                            />
                                        </div>

                                        {/* Metadata Breakdown Block rows */}
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <h4 className="font-semibold text-stone-900 truncate tracking-tight pr-2">
                                                {cartItem.products?.name}
                                            </h4>
                                            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                                                {cartItem.products?.category?.name || "Premium Item"}
                                            </p>
                                            <p className="text-stone-500 font-medium pt-1">
                                                {formatCurrency(itemPrice)} <span className="text-stone-300 mx-1">×</span> {itemQty}
                                            </p>
                                        </div>

                                        {/* Computed Row Total Metric */}
                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-stone-900 block tabular-nums">
                                                {formatCurrency(itemRowTotal)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Sticky computational order pricing totals invoice summary card */}
                <div className="w-full lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-stone-200/50 p-5 sm:p-6 space-y-5 lg:sticky lg:top-24 shadow-xs">
                    <h3 className="text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center gap-2">
                        <Receipt className="h-3.5 w-3.5 text-stone-400" />
                        <span>Order Summary</span>
                    </h3>

                    <div className="space-y-3 text-xs pt-1">
                        <div className="flex justify-between text-stone-500">
                            <span>Bag Subtotal ({totalOrderItems} items)</span>
                            <span className="font-medium text-stone-900 tabular-nums">{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                            <span>Estimated Shipping Charge</span>
                            <span className="font-medium text-stone-400 italic">Calculated next step</span>
                        </div>

                        <hr className="border-stone-100" />

                        <div className="flex justify-between items-baseline pt-1">
                            <span className="text-xs font-bold text-stone-900">Total Payable Amount</span>
                            <span className="text-lg font-bold text-stone-900 tracking-tight tabular-nums">
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <SelectOrderPaymentMethodButton />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CheckoutPage