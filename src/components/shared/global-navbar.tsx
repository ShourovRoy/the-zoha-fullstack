import { Suspense } from "react"
import AuthCartNavbar from "./navbars-utils/auth-cart-navbar"
import Link from "next/link"

// Subtle matching footprint space skeleton
const NavActionsSkeleton = () => (
    <div className="flex items-center gap-4 animate-pulse">
        <div className="h-7 w-12 bg-stone-100 rounded-lg" />
        <div className="h-7 w-16 bg-stone-200/80 rounded-lg" />
    </div>
)

const GlobalNavbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* Left Side Identity Block Layout */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-sm font-bold tracking-tight text-stone-900 flex items-center gap-1.5 select-none">
                        <div className="h-2 w-2 rounded-full bg-stone-900" />
                        <span>STOREFRONT</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-xs font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
                            Home
                        </Link>
                        <Link href="/products" className="text-xs font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
                            Products
                        </Link>
                        <Link href="/categories" className="text-xs font-medium tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
                            Categories
                        </Link>
                    </nav>
                </div>

                {/* Secure Suspense isolated action stage */}
                <Suspense fallback={<NavActionsSkeleton />}>
                    <AuthCartNavbar />
                </Suspense>

            </div>
        </header>
    )
}

export default GlobalNavbar