import { Package, User, CreditCard } from "lucide-react"

export default function OrderDetailsLoading() {
    return (
        <div className="min-h-screen bg-stone-50/40 p-4 sm:p-6 lg:p-8 space-y-6 select-none pointer-events-none">

            {/* Header Skeleton Deck Line */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
                <div className="flex items-center gap-3">
                    {/* Back Arrow Wrapper Placeholder */}
                    <div className="p-4 w-8 h-8 border border-stone-200 bg-white rounded-xl animate-pulse" />

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-32 bg-stone-200 rounded-md animate-pulse" />
                            <div className="h-4 w-16 bg-stone-100 rounded-md animate-pulse" />
                        </div>
                        <div className="h-3 w-48 bg-stone-100 rounded-md animate-pulse" />
                    </div>
                </div>

                {/* Top Deck Status Badge Placeholders */}
                <div className="flex items-center gap-2">
                    <div className="h-6 w-24 bg-stone-200 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-stone-100 rounded-md animate-pulse" />
                </div>
            </div>

            {/* Split Grid Layout Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Area: Cart Lines Table Breakdown Block */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-5">
                        <h2 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                            <Package className="h-4 w-4 text-stone-200" />
                            <div className="h-3 w-44 bg-stone-100 rounded-sm animate-pulse" />
                        </h2>

                        {/* Line Item Skeleton List Iteration Loops */}
                        <div className="divide-y divide-stone-100 overflow-hidden">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start justify-between">
                                    <div className="flex gap-3.5 items-start flex-1">
                                        {/* Media Box Frame Placeholder */}
                                        <div className="h-16 w-16 bg-stone-100 border border-stone-200/60 rounded-xl shrink-0 animate-pulse" />

                                        {/* Product Meta Strings */}
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3.5 bg-stone-200 rounded-md w-2/3 animate-pulse" />
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-12 bg-stone-100 rounded-sm捷 animate-pulse" />
                                                <div className="h-3 w-20 bg-stone-50 rounded-sm animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Multiplier Values Metrics Right Column */}
                                    <div className="text-right shrink-0 space-y-1.5 pt-1">
                                        <div className="h-3.5 w-16 bg-stone-200 rounded-md ml-auto animate-pulse" />
                                        <div className="h-3 w-12 bg-stone-100 rounded-sm ml-auto animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fake Narrative Payload Log Message Section */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="h-2.5 w-36 bg-stone-100 rounded-sm animate-pulse" />
                        <div className="h-10 bg-stone-50/60 rounded-xl border border-stone-100/50 animate-pulse" />
                    </div>
                </div>

                {/* Right Area: Sidebar Logistics Deck Containers */}
                <div className="space-y-6">

                    {/* Shipping Address and Timestamps Core Profile Block */}
                    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-5">
                        <h2 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                            <User className="h-4 w-4 text-stone-200" />
                            <div className="h-3 w-32 bg-stone-100 rounded-sm animate-pulse" />
                        </h2>

                        <div className="space-y-4">
                            {[...Array(3)].map((_, linesIdx) => (
                                <div key={linesIdx} className={`flex gap-2.5 items-start ${linesIdx === 2 ? 'border-t border-stone-100 pt-4' : ''}`}>
                                    <div className="h-4 w-4 bg-stone-100 rounded-full shrink-0 animate-pulse" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-2 w-16 bg-stone-100 rounded-sm捷 animate-pulse" />
                                        <div className={`h-3.5 bg-stone-200 rounded-md animate-pulse ${linesIdx === 1 ? 'w-5/6' : 'w-1/2'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dark Card Primary Invoice Value Totalizer Skeleton */}
                    <div className="bg-stone-900 rounded-2xl p-5 shadow-xs space-y-5 relative overflow-hidden">
                        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2 border-b border-stone-800 pb-3">
                            <CreditCard className="h-4 w-4 text-stone-700" />
                            <div className="h-3 w-28 bg-stone-800 rounded-sm animate-pulse" />
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="h-3 w-16 bg-stone-800 rounded-sm animate-pulse" />
                                <div className="h-3 w-20 bg-stone-700 rounded-sm animate-pulse" />
                            </div>
                            <div className="flex justify-between">
                                <div className="h-3 w-20 bg-stone-800 rounded-sm animate-pulse" />
                                <div className="h-3 w-14 bg-stone-700 rounded-sm animate-pulse" />
                            </div>
                            <div className="flex justify-between border-b border-stone-800 pb-3">
                                <div className="h-3 w-24 bg-stone-800 rounded-sm animate-pulse" />
                                <div className="h-3 w-16 bg-stone-700 rounded-sm animate-pulse" />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="h-4 w-16 bg-stone-700 rounded-md animate-pulse" />
                                <div className="h-6 w-24 bg-stone-800 rounded-md animate-pulse" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}