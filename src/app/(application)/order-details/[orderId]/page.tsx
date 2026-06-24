import { getOrderDetails } from '@/lib/data/order-data'

const page = async ({ params }: {
    params: Promise<{
        orderId: string
    }>
}) => {
    const { orderId } = await params
    const { errorMessage, messsage } = await getOrderDetails(orderId)
    return (
        <div>
            page : {orderId}

            {errorMessage && (
                <>
                    {errorMessage}
                </>
            )}


            {messsage && (
                <>
                    {messsage}
                </>
            )}

        </div>
    )
}

export default page