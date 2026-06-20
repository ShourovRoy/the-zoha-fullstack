import React from 'react'

const loading = () => {
    return (
        <div className="min-h-screen bg-stone-50/50 p-4 sm:p-6 lg:p-8 space-y-6 select-none pointer-events-none">
            {/* Header Skeleton Block */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-5">
                <div className="space-y-2">
                    <div className="h-5 bg-stone-200 w-48 rounded-md animate-pulse flex items-center gap-2" />
                    <div className="h-3 bg-stone-100 w-80 rounded-md animate-pulse" />
                </div>
                <div className="h-7 w-20 bg-stone-200 rounded-lg animate-pulse" />
            </div>

            {/* Grid Collection Skeletons Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="bg-white border border-stone-200/50 rounded-2xl p-5 shadow-xs space-y-5">

                        {/* Upper Header Reference & Tag Skeletons */}
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1.5 flex-1">
                                <div className="h-2.5 bg-stone-100 w-12 rounded-sm animate-pulse" />
                                <div className="h-3.5 bg-stone-200 w-full rounded-md animate-pulse" />
                            </div>
                            <div className="space-y-1 flex flex-col items-end shrink-0">
                                <div className="h-5 w-16 bg-stone-100 rounded-full animate-pulse" />
                                <div className="h-4 w-10 bg-stone-50 rounded-md animate-pulse" />
                            </div>
                        </div>

                        <hr className="border-stone-100" />

                        {/* Middle Metric Stack Alignment Lines */}
                        <div className="space-y-3">
                            {[...Array(4)].map((_, linesIdx) => (
                                <div key={linesIdx} className="flex items-center gap-2">
                                    <div className="h-3.5 w-3.5 bg-stone-100 rounded-full shrink-0 animate-pulse" />
                                    <div className={`h-3 bg-stone-100 rounded-md animate-pulse ${linesIdx === 2 ? 'w-3/4' : linesIdx === 3 ? 'w-1/2' : 'w-2/3'
                                        }`} />
                                </div>
                            ))}
                        </div>

                        {/* Internal Payment Logs Context Skeleton */}
                        <div className="h-12 bg-stone-50 border border-stone-100 rounded-xl animate-pulse" />

                        {/* Lower Footer Action Row Skeleton */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                            <div className="h-3.5 w-20 bg-stone-100 rounded-md animate-pulse" />
                            <div className="h-8 w-24 bg-stone-100 rounded-xl animate-pulse" />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default loading