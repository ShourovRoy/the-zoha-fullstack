'use client'

import { addRemoveCart } from "@/actions/cart/add-or-remove-cart-action";
import { ShoppingBag } from "lucide-react";


const AddToCartBtn = ({
    productId,
    cartId,
    userId,
    quantity,
    actionType,
    isOutOfStock
}: {
    productId: string;
    cartId?: string;
    userId: string;
    quantity: number;
    actionType: "addToCart" | "removeFromCart" | "increment" | "decrement";
    isOutOfStock: boolean,
}) => {

    return (


        <button onClick={() => addRemoveCart({
            userId,
            actionType, productId, cartId, quantity
        })}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${isOutOfStock
                ? "bg-stone-100 text-stone-400 border border-stone-200/50 cursor-not-allowed"
                : "bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md"
                }`}
        >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            {isOutOfStock ? "Unavailable" : "Add to Shopping Bag"}
        </button>

    )
}

export default AddToCartBtn