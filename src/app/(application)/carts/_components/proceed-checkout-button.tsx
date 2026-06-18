import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ProceedCheckoutButton = () => {
    return (
        <Link
            href="/checkout/"
            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-[0.99]">
            <span>Proceed Checkout</span>
            <ArrowRight className="h-3.5 w-3.5" />
        </Link>
    )
}

export default ProceedCheckoutButton