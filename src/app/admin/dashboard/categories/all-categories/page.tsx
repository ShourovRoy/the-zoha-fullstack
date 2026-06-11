import { s3Domain } from "@/config/media-client"
import { getAllCategories } from "@/lib/category"
import Image from "next/image"
import Link from "next/link"
import CategorySearch from "./_components/category-search"
import CategoryPagination from "./_components/category-pagination"

const AllCategories = async ({
  searchParams
}: {
  searchParams: Promise<{
    categoryName?: string;
    page?: string;
  }>
}) => {

  const { categoryName, page } = await searchParams;

  const currentPage = Number(page)




  const { categories, totalPages } = await getAllCategories(categoryName, currentPage)

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">

      {/* Page Title Header block */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">All Categories</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage, search, and monitor your current storefront departments.</p>
      </div>

      {/* Filter Interactive Input Row */}
      <CategorySearch />

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.id || index}
            className="bg-white border border-neutral-200 rounded-md overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Aspect Ratio S3 Image Box */}
            <div className="w-full h-48 bg-stone-50 relative border-b border-neutral-100 flex items-center justify-center overflow-hidden">
              <Image
                width={300}
                height={300}
                src={`${s3Domain}/${category.imageKey}`}
                alt={category.name}
                className="w-full h-full object-cover"
                priority={index < 3} // Optimizes loading speeds for the first few layout elements
              />
            </div>

            {/* Content Details Area */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-neutral-900 tracking-tight">{category.name}</h2>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.desc || "No description provided for this store collection."}
                </p>
              </div>

              {/* Action Call to Action Link button */}
              <Link
                href={`/admin/dashboard/categories/${category.id}`}
                className="w-full py-2 bg-stone-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 text-neutral-700 hover:text-amber-900 text-xs font-medium rounded text-center block transition-colors"
              >
                Show Related Products
              </Link>
            </div>
          </div>
        ))}

      </div>
        <CategoryPagination totalPages={totalPages} />
    </div>
  )
}

export default AllCategories
