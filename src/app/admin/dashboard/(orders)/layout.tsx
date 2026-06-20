import { ReactNode } from 'react'

const OrderLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div>{children}</div>
    )
}

export default OrderLayout