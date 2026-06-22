import { getAllConfirmingInCompleteAvailableOrders } from '@/lib/data/order-data'
import { connection } from 'next/server' // 1. Import the override hook
import React from 'react'

const page = async ({ params }: {
    params: Promise<{
        orderId: string
    }>
}) => {
    // 2. Tell the engine: "Stop compiling this route statically right now."
    await connection() 

    const { orderId } = await params
    const res = await getAllConfirmingInCompleteAvailableOrders()
    
    return (
        <div className="p-6 font-mono text-xs text-stone-600">
            Page Parameter Token: {orderId}
        </div>
    )
}

export default page