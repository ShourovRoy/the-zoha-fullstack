import { ReactNode } from 'react'

const CartLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                <div className="mb-8">
                    <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase block mb-1">
                        Your Order Workspace
                    </span>
                    <h1 className="text-xl font-bold text-stone-900 tracking-tight sm:text-2xl">
                        Shopping Cart
                    </h1>
                </div>
                {children}
            </div>
        </div>
    )
}

export default CartLayout