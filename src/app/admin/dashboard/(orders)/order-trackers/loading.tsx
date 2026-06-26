import { Layers } from "lucide-react"

const OrderTrackersLoading = () => {
    // Generate an array of 6 placeholders to populate the loading grid
    const skeletonCards = Array.from({ length: 6 })

    return (
        <div className="min-h-screen bg-stone-50/50 p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">

            {/* Header Section Skeleton */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-stone-200" />
                        <div className="h-6 w-44 bg-stone-200 rounded-lg" />
                    </div>
                    <div className="h-3 w-64 bg-stone-200/70 rounded-md" />
                </div>
                {/* Metric Badge Skeleton */}
                <div className="h-7 w-28 bg-stone-200 rounded-lg" />
            </div>

            {/* Skeleton Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skeletonCards.map((_, index) => (
                    <div
                        key={`tracker-skeleton-${index}`}
                        className="bg-white border border-stone-200/60 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            {/* Card Header Metadata Skeletons */}
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                {/* Track Log ID Fragment */}
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-2.5 w-16 bg-stone-200/80 rounded" />
                                    <div className="h-4 w-28 bg-stone-200 rounded-md" />
                                </div>
                                {/* Order Ref Fragment */}
                                <div className="space-y-1.5 sm:text-right shrink-0">
                                    <div className="h-2.5 w-16 bg-stone-200/80 rounded sm:ml-auto" />
                                    <div className="h-4 w-24 bg-stone-100 rounded-md sm:ml-auto" />
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Core Data Presentation Rows Skeletons */}
                            <div className="space-y-3">
                                {/* Row 1: Client Name */}
                                <div className="flex items-center gap-2">
                                    <div className="h-3.5 w-3.5 bg-stone-100 rounded-full shrink-0" />
                                    <div className="h-3.5 w-32 bg-stone-200/80 rounded-md" />
                                </div>
                                {/* Row 2: Phone */}
                                <div className="flex items-center gap-2">
                                    <div className="h-3.5 w-3.5 bg-stone-100 rounded-full shrink-0" />
                                    <div className="h-3.5 w-24 bg-stone-200/80 rounded-md" />
                                </div>
                                {/* Row 3: Shipping Address */}
                                <div className="flex items-start gap-2">
                                    <div className="h-3.5 w-3.5 bg-stone-100 rounded-full shrink-0 mt-0.5" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-3.5 w-full bg-stone-200/80 rounded-md" />
                                        <div className="h-3.5 w-4/5 bg-stone-200/80 rounded-md" />
                                    </div>
                                </div>
                                {/* Row 4: Timestamp */}
                                <div className="flex items-center gap-2">
                                    <div className="h-3.5 w-3.5 bg-stone-100 rounded-full shrink-0" />
                                    <div className="h-3.5 w-40 bg-stone-200/80 rounded-md" />
                                </div>
                            </div>
                        </div>

                        {/* Financial and Quantity Footer Row Skeletons */}
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                            {/* Items count skeleton */}
                            <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 bg-stone-100 rounded-md" />
                                <div className="h-3 w-12 bg-stone-200/80 rounded-md" />
                            </div>
                            {/* Price chip skeleton */}
                            <div className="h-7 w-20 bg-stone-100 border border-stone-200/30 rounded-xl" />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderTrackersLoading