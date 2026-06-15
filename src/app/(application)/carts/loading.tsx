export default function Loading() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            {/* Left Skeleton Column */}
            <div className="lg:col-span-8 space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-stone-200/50 p-4 h-28 flex gap-4" />
                ))}
            </div>
            {/* Right Skeleton Column */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/50 p-6 h-64" />
        </div>
    )
}