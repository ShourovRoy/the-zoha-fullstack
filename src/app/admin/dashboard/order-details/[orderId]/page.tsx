import React from 'react'

const page = async ({ params }: {
    params: Promise<{
        orderId: string
    }>
}) => {
    const { orderId } = await params
    return (
        <div>page : {orderId}</div>
    )
}

export default page