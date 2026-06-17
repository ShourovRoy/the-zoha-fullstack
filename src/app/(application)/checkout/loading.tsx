const CheckoutLoadingSkeleton = () => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 md:py-10 animate-pulse">
            {/* Split Grid Parent Layout Framework */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">

                {/* LEFT MAIN BAR SKELETON */}
                <div className="w-full lg:col-span-7 xl:col-span-8 space-y-6">

                    {/* 1. Address Form Block Skeleton */}
                    <div className="bg-white rounded-2xl border border-stone-200/50 p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-32 bg-stone-200 rounded-sm" />
                        </div>
                        <hr className="border-stone-100" />
                        <div className="space-y-2 pt-1">
                            <div className="h-3 w-24 bg-stone-100 rounded-sm" />
                            <div className="h-16 w-full bg-stone-100 rounded-xl" />
                        </div>
                    </div>

                    {/* 2. Cart Items Container Skeleton */}
                    <div className="space-y-3">
                        {/* Section Header Text Skeleton */}
                        <div className="h-3 w-40 bg-stone-200 rounded-sm mx-1" />

                        {/* List Outer Box Container */}
                        <div className="bg-white rounded-2xl border border-stone-200/50 shadow-xs divide-y divide-stone-100 overflow-hidden">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-4 sm:p-5 flex items-start gap-4">
                                    {/* Thumbnail Placeholder */}
                                    <div className="h-16 w-16 bg-stone-100 rounded-xl shrink-0" />

                                    {/* Content Detail Line Rows */}
                                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                                        <div className="h-3.5 w-3/4 bg-stone-200 rounded-sm" />
                                        <div className="h-2.5 w-1/4 bg-stone-100 rounded-sm" />
                                        <div className="h-3 w-16 bg-stone-100 rounded-sm pt-0.5" />
                                    </div>

                                    {/* Row Pricing Metric Placeholder */}
                                    <div className="text-right shrink-0 pt-1">
                                        <div className="h-3.5 w-16 bg-stone-200 rounded-sm ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (ORDER SUMMARY CARD SKELETON) */}
                <div className="w-full lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-stone-200/50 p-5 sm:p-6 space-y-5 lg:sticky lg:top-24 shadow-xs">
                    {/* Summary Card Title Heading */}
                    <div className="h-4 w-28 bg-stone-200 rounded-sm" />

                    {/* Sequential Computation Invoice Detail Stack Rows */}
                    <div className="space-y-4 pt-1">
                        <div className="flex justify-between">
                            <div className="h-3 w-28 bg-stone-100 rounded-sm" />
                            <div className="h-3 w-14 bg-stone-200 rounded-sm" />
                        </div>
                        <div className="flex justify-between">
                            <div className="h-3 w-36 bg-stone-100 rounded-sm" />
                            <div className="h-3 w-20 bg-stone-100 rounded-sm" />
                        </div>

                        <hr className="border-stone-100" />

                        <div className="flex justify-between items-center pt-1">
                            <div className="h-3.5 w-24 bg-stone-200 rounded-sm" />
                            <div className="h-6 w-20 bg-stone-200 rounded-md" />
                        </div>
                    </div>

                    {/* Compact Payment Toggle Button Block Placeholder */}
                    <div className="pt-2 space-y-3">
                        {/* Interactive Pill Selector Track Shape */}
                        <div className="h-9 w-full bg-stone-100 rounded-xl" />

                        {/* Descriptive Legal/Trust Subtext row line */}
                        <div className="h-2.5 w-48 bg-stone-100 rounded-sm mx-1" />

                        {/* Primary Final Execution Trigger Submission Button Shape */}
                        <div className="h-10 w-full bg-stone-200 rounded-xl" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CheckoutLoadingSkeleton