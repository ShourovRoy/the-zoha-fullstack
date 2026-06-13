import { ReactNode, Suspense } from "react"
import ProductCategoriesOptionFilter from "./_components/product-categories-option-filter"

export default function ProductsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-stone-50 w-full text-neutral-900 antialiased">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Borderless Sticky Filter Feed Column */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 py-2">
                        <div>
                            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                                Filters
                            </h3>
                            <p className="text-xs text-neutral-400">
                                Narrow down your browsing feed.
                            </p>
                        </div>

                        <hr className="border-neutral-200/60" />

                        {/* Interactive Async Filters Section */}
                        <div className="space-y-4">
                            <Suspense fallback={
                                <div className="space-y-3">
                                    <div className="h-3 bg-neutral-200/60 rounded-sm animate-pulse w-1/3" />
                                    <div className="space-y-2 pt-1">
                                        <div className="h-3.5 bg-neutral-200/40 rounded-sm animate-pulse w-3/4" />
                                        <div className="h-3.5 bg-neutral-200/40 rounded-sm animate-pulse w-1/2" />
                                        <div className="h-3.5 bg-neutral-200/40 rounded-sm animate-pulse w-2/3" />
                                    </div>
                                </div>
                            }>
                                <ProductCategoriesOptionFilter />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Main Feed Output Column */}
                    <main className="lg:col-span-3 w-full">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    )
}