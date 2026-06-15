import { getProductDetails } from '@/lib/data/product-data'
import ProductImageGallary from '../_components/product-image-gallary'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import AddToCartBtn from '../_components/add-to-cart-button'
import { getUser } from '@/lib/auth/session'

const ProductSlugDetailsPage = async ({
    params
}: {
    params: Promise<{
        slug: string
    }>
}) => {
    const { slug } = await params
    const { errorMessage, productDetails } = await getProductDetails(slug);
    const user = await getUser()

    if (errorMessage || !productDetails) {
        return (
            <div className="min-h-[60vh] max-w-lg mx-auto flex flex-col items-center justify-center p-6 text-center">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-2">Error</span>
                <h1 className="text-sm font-medium text-stone-800">{errorMessage || "Product could not be loaded."}</h1>
                <Link href="/products" className="mt-4 text-xs font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-600 transition-colors">
                    Return to Shop Catalog
                </Link>
            </div>
        )
    }

    const isOutOfStock = (productDetails.quantity ?? 0) <= 0;

    // Formatting currency for local display framework format guidelines
    const formattedPrice = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0,
    }).format(parseFloat(productDetails.price || "0"));

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            {/* Minimalist Navigation Action Node Row */}
            <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-900 transition-colors mb-6 md:mb-10 group"
            >
                <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
                Back to catalog
            </Link>

            {/* Asymmetric Core Layout Split Module */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

                {/* Left Side: Layout Display Arena Node */}
                <div className="md:col-span-6 lg:col-span-7">
                    <ProductImageGallary featuredImageKey={productDetails.featuredImageKey} images={productDetails.galleryImages} />
                </div>

                {/* Right Side: Text Data Stack Pane Node */}
                <div className="md:col-span-6 lg:col-span-5 md:sticky md:top-6 space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/40 shadow-xs">

                    {/* Header Heading Title Identity Block */}
                    <div className="space-y-1.5">
                        {productDetails.category && (
                            <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 block">
                                {productDetails.category.name}
                            </span>
                        )}
                        <h1 className="text-lg sm:text-xl font-semibold text-stone-900 tracking-tight leading-snug">
                            {productDetails.name}
                        </h1>
                        <p className="text-xs text-stone-500 leading-relaxed pt-1 font-normal">
                            {productDetails.shortDesc}
                        </p>
                    </div>

                    <hr className="border-stone-100" />

                    {/* Monetary Transaction Display Row Element */}
                    <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight tabular-nums">
                            {formattedPrice}
                        </span>
                        <div>
                            {isOutOfStock ? (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    স্টক শেষ
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    In Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Primary Buy Action Trigger Interface Element */}
                    <div className="pt-1">
                        <AddToCartBtn
                            actionType='addToCart'
                            isOutOfStock={isOutOfStock}
                            productId={productDetails.id}
                            userId={user.userId}
                            quantity={1}
                            cartId={undefined}
                        />
                    </div>

                    {/* Expanded Rich Content Block Field Section */}
                    {productDetails.desc && (
                        <div className="pt-5 border-t border-stone-100 space-y-2">
                            <h3 className="text-xs font-bold text-stone-800 tracking-wide uppercase">
                                Specifications
                            </h3>
                            <p className="text-xs text-stone-500 leading-relaxed font-normal whitespace-pre-line">
                                {productDetails.desc}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ProductSlugDetailsPage