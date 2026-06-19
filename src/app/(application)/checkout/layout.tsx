import { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react"

const CheckoutLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-stone-50/50 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">

            {/* 1. MINIMAL SECURE CHECKOUT HEADER */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

                    {/* Back to Shopping Anchor */}
                    <Link
                        href="/carts"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>Return to Bag</span>
                    </Link>

                    {/* Centered Compact Identity Title */}
                    <div className="flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-stone-900 stroke-[2.5]" />
                        <span className="text-xs font-bold tracking-wider uppercase text-stone-900">
                            Secure Checkout
                        </span>
                    </div>

                    {/* Right-Side Trust Architecture */}
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold bg-emerald-50/60 border border-emerald-100/80 px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 fill-emerald-50" />
                        <span className="hidden sm:inline tracking-wide uppercase text-[10px]">End-to-End Encrypted</span>
                    </div>
                </div>
            </header>

            {/* 2. DYNAMIC PAGE INJECTION FRAMEWORK */}
            <main className="flex-1 w-full">
                {children}
            </main>



        </div>
    )
}

export default CheckoutLayout