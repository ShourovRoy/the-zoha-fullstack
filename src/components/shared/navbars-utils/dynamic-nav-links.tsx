'use client'

import { SessionPayload } from "@/lib/auth/session"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, User } from "lucide-react"

const DynamicNavLinks = ({ user, cartCount }: { user: SessionPayload | null, cartCount: number }) => {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    // Evaluate guest state or authenticated indicators safely
    const isAuthenticated = user && user.userId && user.role;

    return (
        <div className="flex items-center gap-4 sm:gap-6 animate-in fade-in duration-300">

            {/* Shareable Persistent Core Shopping Cart Trigger Icon */}
            <Link
                href="/carts"
                className={`relative p-2 rounded-xl border border-transparent transition-all flex items-center justify-center hover:bg-stone-50 group ${isActive('/cart')
                    ? 'text-stone-900 bg-stone-50 border-stone-200/40'
                    : 'text-stone-600 hover:text-stone-900'
                    }`}
            >
                <ShoppingBag className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />

                {/* Micro Cart Badge Component */}
                {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 bg-stone-900 text-[9px] font-bold text-white rounded-full flex items-center justify-center scale-90 select-none tracking-tighter tabular-nums animate-in fade-in zoom-in-75 duration-200 border border-white">
                        {cartCount > 99 ? '99+' : cartCount}
                    </span>
                )}
            </Link>

            <div className="h-4 w-px bg-stone-200" />

            {/* Condition Module Branch UI Layout */}
            {isAuthenticated ? (
                <Link
                    href="/account"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium tracking-wide flex items-center gap-2 transition-all ${isActive('/account')
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200/80 hover:border-stone-400 hover:bg-stone-50'
                        }`}
                >
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline">
                        {user.role === 'admin' ? 'Dashboard' : 'My Account'}
                    </span>
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="text-xs font-semibold text-stone-500 hover:text-stone-900 px-2.5 py-1.5 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            )}

        </div>
    )
}

export default DynamicNavLinks