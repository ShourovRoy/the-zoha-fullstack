

export function formatPriceInBdt(price: string) {
    const formattedPrice = new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
    }).format(parseFloat(price))
    return formattedPrice
}