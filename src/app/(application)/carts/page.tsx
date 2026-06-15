import { getCartItems } from "@/lib/data/cart-data"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Layers } from "lucide-react"

const getAssetUrl = (key?: string | null) => {
    if (!key) return null
    if (key.startsWith('http')) return key
    return `${process.env.NEXT_PUBLIC_S3_MEDIA_DOMAIN}/${key}`
}

const CartPage = async () => {
    const { cartItems } = await getCartItems()
    const hasItems = cartItems && cartItems.length > 0

    // Calculate currency details totals dynamically
    const subtotal = cartItems?.reduce((acc, item) => {
        const price = parseFloat(item.products?.price || "0")
        const qty = item.quantity || 1
        return acc + price * qty
    }, 0) || 0

    const formattedSubtotal = new Intl.NumberFormat('bn-BD', {
        style: 'currency', currency: 'BDT', minimumFractionDigits: 0
    }).format(subtotal)

    if (!hasItems) {
        return (
            <div className="bg-white rounded-2xl border border-stone-200/40 p-12 text-center max-w-md mx-auto mt-8 shadow-xs animate-in fade-in duration-200">
                <div className="h-10 w-10 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                    <ShoppingBag className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-stone-900">Your shopping bag is completely empty</h2>
                <p className="text-xs text-stone-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Explore our collection catalog to find premium pieces for your workspace setup.
                </p>
                <Link href="/products" className="mt-5 inline-flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs">
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">

            {/* Left Side: Interactive Line Item List Array Map */}
            <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item, index) => {
                    const imageUrl = getAssetUrl(item.products?.featuredImageKey)
                    const formattedItemPrice = new Intl.NumberFormat('bn-BD', {
                        style: 'currency', currency: 'BDT', minimumFractionDigits: 0
                    }).format(parseFloat(item.products?.price || "0"))

                    return (
                        <div
                            key={item.id || index}
                            className="bg-white rounded-2xl border border-stone-200/40 p-4 flex gap-4 items-center justify-between shadow-xs relative group transition-all duration-200 hover:border-stone-300/80"
                        >
                            {/* Context & Media Layout Wrapper */}
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <div className="h-20 w-20 aspect-square rounded-xl bg-stone-50 border border-stone-100 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                    {imageUrl ? (
                                        <Image
                                            loading="eager"
                                            src={imageUrl}
                                            alt={item.products?.name || "Product preview Asset Image"}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                            unoptimized // Keeps external S3 fetch pipelines unthrottled during raw sandbox debugging
                                        />
                                    ) : (
                                        <ShoppingBag className="h-5 w-5 text-stone-300" />
                                    )}
                                </div>
                                <div className="min-w-0 space-y-1">
                                    {/* Category Indicator Tag */}
                                    {item.products?.category?.name && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-400 bg-stone-50 px-1.5 py-0.5 rounded-md border border-stone-100 uppercase tracking-wider">
                                            <Layers className="h-2.5 w-2.5" />
                                            {item.products.category.name}
                                        </span>
                                    )}
                                    <h3 className="text-xs font-bold text-stone-900 truncate tracking-tight pr-4 block pt-0.5">
                                        {item.products?.name || "Premium Workspace Asset"}
                                    </h3>
                                    <div className="text-xs font-semibold text-stone-900 tabular-nums">
                                        {formattedItemPrice}
                                    </div>
                                    <span className="text-[9px] text-stone-300 font-mono block tracking-tight truncate max-w-[120px]">
                                        ID: {item.id}
                                    </span>
                                </div>
                            </div>

                            {/* Adjustment Actions Group Interface Control */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 flex-shrink-0">
                                {/* Programmatic Counter Tool Blocks */}
                                <div className="flex items-center border border-stone-200/80 rounded-lg bg-stone-50/50 p-0.5 h-8">
                                    <button className="p-1 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all active:scale-95">
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="text-xs font-bold text-stone-800 px-3 min-w-[28px] text-center tabular-nums">
                                        {item.quantity || 1}
                                    </span>
                                    <button className="p-1 text-stone-500 hover:text-stone-900 hover:bg-white rounded-md transition-all active:scale-95">
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Absolute Item Trash Purge Trigger */}
                                <button className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50/50 transition-colors">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Right Side: Fixed Order Invoice Breakdown Sidebar Pane */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/40 p-5 sm:p-6 space-y-5 lg:sticky lg:top-24 shadow-xs">
                <h3 className="text-xs font-bold text-stone-800 tracking-wider uppercase">
                    Order Summary
                </h3>

                <div className="space-y-3 text-xs pt-1">
                    <div className="flex justify-between text-stone-500">
                        <span>Items Subtotal</span>
                        <span className="font-medium text-stone-900 tabular-nums">{formattedSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                        <span>Delivery Fee</span>
                        <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-sm uppercase text-[10px] tracking-wider">
                            Free Shipping
                        </span>
                    </div>
                    <hr className="border-stone-100" />
                    <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs font-bold text-stone-900">Estimated Total</span>
                        <span className="text-lg font-bold text-stone-900 tracking-tight tabular-nums">
                            {formattedSubtotal}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <button className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-[0.99]">
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default CartPage