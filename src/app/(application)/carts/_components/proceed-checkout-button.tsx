'use client'

import { checkoutCart } from '@/actions/cart/checkout-cart-action'
import { ArrowRight } from 'lucide-react'

const ProceedCheckoutButton = () => {
    return (
        <button
            onClick={async () => {
                const res = await checkoutCart()
                console.log(res)
            }}

            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-[0.99]">
            <span>Proceed to Secure Checkout</span>
            <ArrowRight className="h-3.5 w-3.5" />
        </button>
    )
}

export default ProceedCheckoutButton