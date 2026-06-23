
const ProductDetailsPage = async ({
    params
}: {
    params: Promise<{
        slug: string
    }>
}) => {
    const { slug } = await params;
    return (
        <div> ProductDetailsPage: {slug}</div>
    )
}

export default ProductDetailsPage 