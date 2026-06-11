'use client'

import Link from "next/link"
import { 
    FolderPlus, 
    Layers,
    UploadCloud, 
    Boxes, 
    ShoppingBag, 
    Truck, 
    CheckCircle2 
} from "lucide-react"

const AdminDashboard = () => {
    // Keep data array localized here to populate the quick-action dashboard grid cards
    const quickActions = [
        { label: "Create Category", href: "/admin/dashboard/create-category", icon: FolderPlus },
        { label: "All Categories", href: "/admin/dashboard/categories", icon: Layers },
        { label: "Upload Product", href: "/admin/dashboard/upload-product", icon: UploadCloud },
        { label: "Product Inventory", href: "/admin/dashboard/inventory", icon: Boxes },
        { label: "Available Orders", href: "/admin/dashboard/available-orders", icon: ShoppingBag },
        { label: "Order In Process", href: "/admin/dashboard/processing-orders", icon: Truck },
        { label: "Completed Orders", href: "/admin/dashboard/completed-orders", icon: CheckCircle2 },
    ]

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header section matching the workspace standard */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                    Admin Dashboard
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Overview of your multi-category marketplace control panel.
                </p>
            </div>

            {/* Responsive Grid system containing the minimal card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {quickActions.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link 
                            key={item.label}
                            href={item.href}
                            className="block p-5 bg-white border border-neutral-200 rounded-md shadow-xs hover:border-amber-500 hover:shadow-sm transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 bg-stone-50 rounded-md group-hover:bg-amber-50 transition-colors">
                                    <Icon className="h-5 w-5 text-neutral-600 group-hover:text-amber-600 transition-colors" />
                                </div>
                                <span className="text-xs font-medium text-neutral-400 group-hover:text-amber-600 transition-colors">
                                    Manage &rarr;
                                </span>
                            </div>
                            <h2 className="text-base font-medium text-neutral-900 group-hover:text-amber-700 transition-colors">
                                {item.label}
                            </h2>
                            <p className="text-xs text-neutral-400 mt-1">
                                Click to configure your system's {item.label.toLowerCase()}.
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default AdminDashboard