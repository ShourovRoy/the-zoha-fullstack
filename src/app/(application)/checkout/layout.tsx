import { ReactNode } from "react"

const CheckoutLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div>
            <h1>Checkout Layout</h1>
            {children}
        </div>
    )
}

export default CheckoutLayout