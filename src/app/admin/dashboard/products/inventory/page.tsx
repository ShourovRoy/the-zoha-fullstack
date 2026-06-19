import { getAllProducts } from "@/lib/data/product-data"
import Image from "next/image"
import Link from "next/link"
import { Package, Folder, Layers, Pencil, PlusCircle, AlertCircle, Eye } from "lucide-react"
import InventorySearch from "./_components/inventory-search"
import InventoryPagination from "./_components/inventory-pagination"

const getAssetUrl = (key: string) => {
    if (key.startsWith('http')) return key;
    return `${process.env.NEXT_PUBLIC_S3_MEDIA_DOMAIN}/${key}`;
}

const InventoryPage = async ({
    searchParams
}: {
    searchParams: Promise<{
        productName?: string;
        page?: number;
    }>
}) => {
    const { productName, page } = await searchParams;
    const { products, totalPages } = await getAllProducts(productName, page)

    const hasProducts = products && products.length > 0

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* Admin Header with Action Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                        <Package className="h-5 w-5 text-amber-500" />
                        Inventory Catalog Management
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Manage your products, update details, monitor image assets, and organize store categories.
                    </p>
                </div>
                <div>
                    <Link
                        href="/admin/inventory/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors shadow-xs"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Context Actions Block (Always visible to keep filtering functional) */}
            <div className="flex items-center justify-between gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                <InventorySearch />
                {hasProducts && (
                    <span className="text-xs font-medium text-neutral-500 hidden sm:inline-block">
                        Showing {products.length} catalog record{products.length === 1 ? '' : 's'}
                    </span>
                )}
            </div>

            {/* Conditional Main Grid Contexts */}
            {!hasProducts ? (
                <div className="p-12 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-stone-50/40">
                    <AlertCircle className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-neutral-900">
                        {productName ? "No Matching Results" : "No Inventory Records Found"}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                        {productName
                            ? `We couldn't find any assets matching "${productName}". Try checking spelling errors or modifying search variables.`
                            : "Get started by creating your first product listing entry into the registry catalog system."
                        }
                    </p>
                    {!productName && (
                        <Link
                            href="/admin/inventory/new"
                            className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add First Product
                        </Link>
                    )}
                </div>
            ) : (
                <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-4 w-20">Image</th>
                                    <th className="p-4">Product Info</th>
                                    <th className="p-4 hidden md:table-cell">Category</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-center hidden sm:table-cell">Stock Level</th>
                                    <th className="p-4 text-center hidden lg:table-cell">Alert Status</th>
                                    <th className="p-4 hidden xl:table-cell text-center">Gallery</th>
                                    <th className="p-4 text-center w-38">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-sm text-neutral-700">
                                {products.map((product) => {
                                    const formattedPrice = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(parseFloat(product.price))

                                    const stock = product.quantity ?? 0
                                    const threshold = product.thresholdQuantity ?? 0
                                    const isOutOfStock = stock <= 0
                                    const isLowStock = !isOutOfStock && stock <= threshold

                                    return (
                                        <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">

                                            {/* Thumbnail */}
                                            <td className="p-4">
                                                <div className="relative h-12 w-12 rounded-lg border border-neutral-200 bg-neutral-100 overflow-hidden shrink-0">
                                                    <Image
                                                        src={getAssetUrl(product.featuredImageKey)}
                                                        alt={product.name}
                                                        fill
                                                        sizes="48px"
                                                        className="object-cover"
                                                        priority={true}
                                                        loading="eager"
                                                    />
                                                </div>
                                            </td>

                                            {/* Info */}
                                            <td className="p-4 max-w-60 sm:max-w-xs md:max-w-sm">
                                                <div className="font-semibold text-neutral-900 truncate">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-neutral-400 truncate mt-0.5">
                                                    {product.shortDesc}
                                                </div>
                                            </td>

                                            {/* Category Badge */}
                                            <td className="p-4 hidden md:table-cell">
                                                {product.category ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-200/60 rounded-md text-neutral-700 text-xs font-medium">
                                                        <Folder className="h-3 w-3 text-neutral-400" />
                                                        {product.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-neutral-400 italic">Unassigned</span>
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="p-4 text-right font-medium text-neutral-900 tabular-nums">
                                                {formattedPrice}
                                            </td>

                                            {/* Stock Level Counter */}
                                            <td className="p-4 text-center hidden sm:table-cell tabular-nums font-medium">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className={isOutOfStock ? "text-red-600 font-bold" : isLowStock ? "text-amber-600" : "text-neutral-800"}>
                                                        {stock} units
                                                    </span>
                                                    <span className="text-[10px] text-neutral-400 tracking-tight block">
                                                        Min Alert: {threshold}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Warning Threshold Badges */}
                                            <td className="p-4 text-center hidden lg:table-cell">
                                                {isOutOfStock ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 border border-red-200/60 text-red-700 text-xs font-semibold">
                                                        Out of Stock
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold animate-pulse">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/40 text-emerald-700 text-xs font-medium">
                                                        Healthy
                                                    </span>
                                                )}
                                            </td>

                                            {/* Gallery Asset Count */}
                                            <td className="p-4 hidden xl:table-cell text-center">
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 border border-neutral-200/60 rounded-md text-neutral-600 text-xs font-medium">
                                                    <Layers className="h-3 w-3 text-neutral-400" />
                                                    <span>{product.galleryImages?.length || 0}</span>
                                                </div>
                                            </td>

                                            {/* Operational Controls */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/inventory/${product.id}`}
                                                        title="View Product Details"
                                                        className="p-1.5 hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-600 transition-colors"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/inventory/${product.id}/edit`}
                                                        title="Edit Product Details"
                                                        className="p-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 rounded-md text-amber-700 transition-colors"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>


                    {/* pagination */}
                    <InventoryPagination totalPages={totalPages} />
                </div>
            )}
        </div>
    )
}

export default InventoryPage