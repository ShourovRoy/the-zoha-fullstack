import { getAllProducts } from "@/lib/data/product-data"

const InventoryPage = async () => {
    const products = await getAllProducts()
    return (
        <div>
            {products.map((product, index) => (
                <div key={product.id || index}>

                    <h3>{product.name}</h3>

                </div>
            ))}
        </div>
    )
}

export default InventoryPage