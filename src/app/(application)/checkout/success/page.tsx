import { getUser } from "@/lib/auth/session"

const CheckoutSuccessPage = async () => {

    const user = await getUser(false)


    return (
        <div>
            <h1>Payment Successfull {user?.userId}</h1>
        </div>
    )
}

export default CheckoutSuccessPage