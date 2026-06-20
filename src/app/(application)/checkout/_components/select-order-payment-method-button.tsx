'use client'

import { useState } from "react"
import { ArrowRight, CreditCard, Banknote, Shield } from "lucide-react"
import { sslCommerceCheckout } from "@/actions/checkout/ssl-commerce-checkout-action"
import { cashOneDeliveryCheckout } from "@/actions/checkout/cash-on-delivery-checkout-action"
import { redirect, usePathname } from "next/navigation"

type PaymentType = 'COD' | 'SSL_COMMERZE'

const CompactPaymentSelection = ({ shippingAddress, contactNumber }: {
    shippingAddress?: string;
    contactNumber?: string;
}) => {
    const pathname = usePathname();
    const [paymentMethod, setPaymentMethod] = useState<PaymentType>('COD')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)


    return (
        <div className="w-full space-y-3">
            {/* 1. Toggle Selector Track Row */}
            <div className="bg-stone-100 p-1 rounded-xl flex gap-1 items-center">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex-1 text-center py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'COD'
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                        }`}
                >
                    <Banknote className="h-3.5 w-3.5 shrink-0" />
                    <span>Cash on Delivery</span>
                </button>

                <button
                    type="button"
                    onClick={() => setPaymentMethod('SSL_COMMERZE')}
                    className={`flex-1 text-center py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'SSL_COMMERZE'
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                        }`}
                >
                    <CreditCard className="h-3.5 w-3.5 shrink-0" />
                    <span>SSLCommerze</span>
                </button>
            </div>

            {/* 2. Compact Inline Notice Text */}
            <div className="flex items-center gap-1.5 px-1 text-[11px] text-stone-400 font-medium">
                <Shield className="h-3 w-3 shrink-0 text-stone-400" />
                <span>
                    {paymentMethod === 'COD'
                        ? 'Pay with physical cash directly upon home arrival.'
                        : 'Secure redirection to digital banking channels.'}
                </span>
            </div>

            {/* 3. Action Processing Checkout Button */}
            <button onClick={async () => {
                setIsLoading(true)
                if (paymentMethod === "SSL_COMMERZE") {
                    const res = await sslCommerceCheckout(shippingAddress, contactNumber) as { redirectUrl?: string, errorMessage?: string } | null
                    setIsLoading(false)
                    if (res?.errorMessage) {
                        setErrorMessage(res.errorMessage)
                    }

                    if (res && res.redirectUrl) {
                        redirect(res.redirectUrl)
                    }
                } else {
                    const res = await cashOneDeliveryCheckout({
                        pathName: pathname,
                        customPhoneNumber: contactNumber,
                        customShippingAddress: shippingAddress,
                    })
                    setIsLoading(false)
                    if (res?.errorMessage) {
                        setErrorMessage(res.errorMessage)
                    }

                    if (res?.redirectUrl) {
                        redirect(res.redirectUrl)
                    }
                }

            }} className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-[0.99] cursor-pointer">
                {paymentMethod === 'COD' ? (
                    <>
                        {isLoading ? (
                            <>
                                Placing Order...
                            </>
                        ) : (
                            <>
                                <Banknote className="h-3.5 w-3.5 opacity-80" />
                                <span>Place Order</span>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {isLoading ? (
                            <>
                                Making Connection with gateway...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-3.5 w-3.5 opacity-80" />
                                <span>Pay with SSLCommerze </span>
                            </>
                        )}
                    </>
                )}
                <ArrowRight className="h-3 w-3 ml-auto opacity-60" />
            </button>
        </div>
    )
}

export default CompactPaymentSelection