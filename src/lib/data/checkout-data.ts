import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getUser } from "../auth/session";
import { getCartItems } from "./cart-data";
import { db } from "@/database/db";
import { usersTable } from "@/database/schemas/user";
import { eq } from "drizzle-orm";



export async function getCheckOutCarts() {
    try {

        const user = await getUser(true)

        const { cartItems } = await getCartItems(false, user?.userId)

        if (cartItems.length === 0) {
            throw new Error("Cart has been empty!")
        }

        let totalPrice: number = 0.00
        let totalOrderItems: number = 0;


        for (let cartItemIndex = 0; cartItemIndex < cartItems.length; cartItemIndex++) {
            const cartItem = cartItems[cartItemIndex];

            const cartItemPrice = Number(cartItem.products?.price) * Number(cartItem.quantity!)
            totalPrice = totalPrice + cartItemPrice
            totalOrderItems = totalOrderItems + Number(cartItem.quantity)
        }

        // user details
        const users = await db.select().from(usersTable).where(eq(usersTable.id, user?.userId!))

        if (!users || users.length === 0) {
            return {
                errorMessage: "Please login!",
                userDetails: null,
            }


        }

        const userDetails = users[0]


        return {
            cartItems,
            totalOrderItems,
            totalPrice,
            userDetails
        }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            errorMessage: "Something went wrong during checkout."
        }
    }

}

