import { Loader2 } from "lucide-react"

export default function CheckoutSuccessLoading() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-50/40 select-none pointer-events-none">
            <div className="w-full max-w-md bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm space-y-6">

                {/* Animated Spinner & Center Anchor */}
                <div className="text-center space-y-3 py-2">
                    <div className="h-12 w-12 bg-stone-50 rounded-full flex items-center justify-center mx-auto border border-stone-100">
                        <Loader2 className="h-5 w-5 text-stone-400 animate-spin" />
                    </div>
                    <div className="space-y-2 max-w-60 mx-auto">
                        <div className="h-4 bg-stone-200 rounded-md animate-pulse mx-auto w-3/4" />
                        <div className="h-3 bg-stone-100 rounded-md animate-pulse mx-auto w-full" />
                    </div>
                </div>

                {/* Pulse Metadata Bar */}
                <div className="h-9 bg-stone-50 border border-stone-100 rounded-xl animate-pulse" />

                {/* Receipt Grid Skeleton Slices */}
                <div className="space-y-3">
                    <div className="h-3 bg-stone-200 rounded-md animate-pulse w-1/3" />
                    <div className="border border-stone-100 rounded-xl divide-y divide-stone-100 overflow-hidden">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="flex justify-between p-3.5 items-center">
                                <div className="h-3 bg-stone-100 rounded-md animate-pulse w-1/4" />
                                <div className="h-3 bg-stone-200 rounded-md animate-pulse w-1/3" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Action Grid Skeleton */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-9 bg-stone-100 rounded-xl animate-pulse" />
                    <div className="h-9 bg-stone-200 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    )
}