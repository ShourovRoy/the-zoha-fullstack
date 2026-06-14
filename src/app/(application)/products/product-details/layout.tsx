import { ReactNode } from "react"


const ProductDetailsLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default ProductDetailsLayout