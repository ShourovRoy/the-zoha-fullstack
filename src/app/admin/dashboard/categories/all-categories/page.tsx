import { s3Domain } from "@/config/media-client"
import { getAllCategories } from "@/lib/data/category-data"
import Image from "next/image"
import Link from "next/link"
import { FolderOpen, PlusCircle, AlertCircle, Eye } from "lucide-react"
import CategorySearch from "./_components/category-search"
import CategoryPagination from "./_components/category-pagination"

interface PageProps {
  searchParams: Promise<{
    categoryName?: string;
    page?: string;
  }>
}

const AllCategories = async ({ searchParams }: PageProps) => {
  const { categoryName, page } = await searchParams;
  const currentPage = Number(page) || 1

  const { categories, totalPages } = await getAllCategories(categoryName, currentPage)
  const hasCategories = categories && categories.length > 0

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

      {/* Admin Header with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-amber-500" />
            Storefront Department Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage, search, and monitor your active retail collections and marketplace configurations.
          </p>
        </div>
        <div>
          <Link
            href="/admin/dashboard/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Context Actions Block (Keeps filter UI locked in position) */}
      <div className="flex items-center justify-between gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
        <CategorySearch />
        {hasCategories && (
          <span className="text-xs font-medium text-neutral-500 hidden sm:inline-block">
            Showing {categories.length} department cluster{categories.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Main Catalog View Grid / Fallbacks */}
      {!hasCategories ? (
        <div className="p-12 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-stone-50/40">
          <AlertCircle className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">
            {categoryName ? "No Matching Results" : "No Category Entries Tracked"}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {categoryName
              ? `We couldn't find any departments matching "${categoryName}". Try clearing input conditions.`
              : "Create your initial storefront collection to anchor incoming inventory products."
            }
          </p>
          {!categoryName && (
            <Link
              href="/admin/dashboard/categories/new"
              className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Create First Category
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id || index}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-all group"
              >
                {/* Image Container with Hover Effects */}
                <div className="w-full h-48 bg-neutral-50 relative border-b border-neutral-100 overflow-hidden shrink-0">
                  <Image
                    width={400}
                    height={300}
                    src={`${s3Domain}/${category.imageKey}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    priority={index < 3}
                    loading="eager"
                  />
                </div>

                {/* Info Text Area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                      {category.name}
                    </h2>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {category.desc || "No custom department overview description documented for this listing tracking channel."}
                    </p>
                  </div>

                  {/* Core Form Button Links */}
                  <Link
                    href={`/admin/dashboard/categories/${category.id}`}
                    className="w-full py-2 bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 text-neutral-700 hover:text-amber-900 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                    Show Related Products
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Render the Pagination Controller Row */}
          {totalPages > 1 && (
            <div className="pt-4 border-t border-neutral-100">
              <CategoryPagination totalPages={totalPages} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AllCategories