import { ReactNode } from "react"


const ProductDetailsLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div className="bg-stone-50">

            {children}

        </div>
    )
}

export default ProductDetailsLayout