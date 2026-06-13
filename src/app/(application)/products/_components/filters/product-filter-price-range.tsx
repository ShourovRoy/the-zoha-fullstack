'use server'

import { getProductPriceBoundaries } from "@/lib/data/product-data"
import ProductFilterByPriceRange from "./product-filter-by-price-range"

const ProductFilterPriceRange = async () => {
    const { minPrice, maxPrice } = await getProductPriceBoundaries()
    return <ProductFilterByPriceRange maxPrice={maxPrice} minPrice={minPrice} />

}

export default ProductFilterPriceRange