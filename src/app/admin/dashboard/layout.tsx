'use client'

import { ReactNode, Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FolderPlus,
    Layers,
    UploadCloud,
    Boxes,
    ShoppingBag,
    Truck,
    CheckCircle2,
    LogOut,
    Menu,
    X
} from "lucide-react"


const DynamicLink = ({
    setIsMobileMenuOpen
}: {
    setIsMobileMenuOpen: (open: boolean) => void
}) => {
    const pathname = usePathname()


    const navItems = [
        { label: "Create Category", href: "/admin/dashboard/categories/create-new-category/", icon: FolderPlus },
        { label: "All Categories", href: "/admin/dashboard/categories/all-categories/", icon: Layers },
        { label: "Upload Product", href: "/admin/dashboard/products/create-new-product/", icon: UploadCloud },
        { label: "Product Inventory", href: "/admin/dashboard/products/inventory/", icon: Boxes },
        { label: "Available Orders", href: "/admin/dashboard/available-orders/", icon: ShoppingBag, count: 5 },
        { label: "Order In Process", href: "/admin/dashboard/processing-orders", icon: Truck, count: 2 },
        { label: "Completed Orders", href: "/admin/dashboard/completed-orders", icon: CheckCircle2 },
    ]

    return (
        <div>
            {/* Main Navigation Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-3 mb-2">
                    Core Management
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon
                    // Highlight link if active
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group ${isActive
                                ? "bg-amber-50 text-amber-900 font-semibold"
                                : "text-neutral-700 hover:bg-stone-50 hover:text-neutral-900"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-amber-600" : "text-neutral-400 group-hover:text-amber-600"
                                    }`} />
                                <span>{item.label}</span>
                            </div>
                            {item.count && (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? "bg-amber-200 text-amber-900" : "bg-amber-100 text-amber-800"
                                    }`}>
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    // Local state to track whether the mobile side-drawer is active
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-neutral-900 relative">

            {/* 1. Mobile Top Header Bar */}
            <div className="w-full bg-white border-b border-neutral-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-50">
                <div className="text-lg font-bold tracking-tight">
                    <Link href="/admin/dashboard/available-orders/">
                        your<span className="text-amber-600">shop</span>
                    </Link>
                    <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-1.5 border border-neutral-200 rounded-md text-neutral-700 hover:bg-stone-50 focus:outline-none cursor-pointer"
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* 2. Persistent Responsive Sidebar Drawer */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0 
                transform transition-transform duration-200 ease-in-out pt-16 md:pt-0
                md:static md:translate-x-0
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                {/* Desktop Branding Header */}
                <div className="p-5 border-b border-neutral-100 hidden md:block">
                    <div className="text-xl font-bold tracking-tight">
                        your<span className="text-amber-600">shop</span>
                        <span className="text-xs font-medium text-neutral-400 ml-1.5 uppercase tracking-wider block">Admin Panel</span>
                    </div>
                </div>

                <Suspense fallback={<>
                    <div className="p-4 space-y-1">
                        <div className="h-8 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
                        <div className="h-8 w-1/2 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                </>} >
                    <DynamicLink
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                </Suspense>


                {/* Footer Controls */}
                <div className="p-4 border-t border-neutral-100 bg-stone-50/50">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* 3. Tap-to-dismiss background backdrop tint for mobile viewports */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-neutral-900/20 backdrop-blur-xs z-30 md:hidden"
                />
            )}

            {/* 4. Injection Workspace Window for Sub-route Content */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                {children}
            </main>


        </div>
    )
}

export default DashboardLayout