import { getAllProducts } from '@/lib/data/product-data'
import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"
import ProductPagination from './_components/product-pagination'
import ProductSearch from './_components/product-search'
import AddToBagButton from './_components/add-to-bag-button'

const getAssetUrl = (key: string) => {
    if (!key) return "";
    if (key.startsWith('http')) return key;
    return `${process.env.NEXT_PUBLIC_S3_MEDIA_DOMAIN}/${key}`;
}

interface PageProps {
    searchParams: Promise<{
        productName?: string;
        page?: number;
        categoryId?: string;
        minPrice?: number;
        maxPrice?: number;
    }>
}

const ProductsPage = async ({ searchParams }: PageProps) => {
    const { productName, page, categoryId, minPrice, maxPrice } = await searchParams
    const currentPage = Number(page) || 1

    const { products, totalPages } = await getAllProducts(productName, currentPage, categoryId, minPrice, maxPrice)
    const hasProducts = products && products.length > 0

    return (
        <div className="space-y-6">
            {/* Control Strip: Independent white block casting depth shadow on the stone canvas */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl shadow-xs">
                <ProductSearch />
                {hasProducts && (
                    <span className="text-xs font-medium text-neutral-400 tabular-nums px-1">
                        Showing {products.length} item{products.length === 1 ? '' : 's'}
                    </span>
                )}
            </div>

            {/* Catalog Products Display Grid */}
            {!hasProducts ? (
                <div className="p-12 text-center bg-white rounded-xl shadow-xs">
                    <h3 className="text-sm font-semibold text-neutral-900">
                        {productName ? "No results found" : "Catalog empty"}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                        {productName
                            ? `We couldn't find matches for "${productName}". Try checking spelling.`
                            : "New product clusters are uploaded periodically."
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Clean Cards: Floating cleanly via soft shadow with no wrapper lines */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {products.map((product) => {
                            // Formatted for Bangladeshi Taka standard presentation (Whole numbers)
                            const formattedPrice = new Intl.NumberFormat('bn-BD', {
                                style: 'currency',
                                currency: 'BDT',
                                currencyDisplay: 'symbol',
                                minimumFractionDigits: 2,
                            }).format(parseFloat(product.price))

                            const isOutOfStock = (product.quantity ?? 0) <= 0

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow duration-200"
                                >
                                    {/* Flat Image Stage Container */}
                                    <div className="w-full aspect-square bg-neutral-50 relative shrink-0">
                                        <Image
                                            fill
                                            sizes="(max-w-7xl) 33vw, 50vw, 100vw"
                                            src={getAssetUrl(product.featuredImageKey)}
                                            alt={product.name}
                                            className="object-cover"
                                        />
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-neutral-900 bg-white px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
                                                    স্টক শেষ
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Clean Minimal Typography Layer */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <h2 className="text-sm font-medium text-neutral-900 truncate">
                                                    {product.name}
                                                </h2>
                                                <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                                                    {formattedPrice}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-400 truncate">
                                                {product.shortDesc}
                                            </p>
                                        </div>

                                        {/* Action Controls Group */}
                                        <div className="grid grid-cols-4 gap-2">
                                            <Link
                                                href={`/product-details/${product.slug}/`}
                                                className="col-span-1 border border-neutral-200 hover:bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <AddToBagButton isOutOfStock={isOutOfStock} productId={product.id} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Flat Directory Pagination Wrapper */}
                    {totalPages > 1 && (
                        <div className="pt-2">
                            <ProductPagination totalPages={totalPages} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ProductsPage