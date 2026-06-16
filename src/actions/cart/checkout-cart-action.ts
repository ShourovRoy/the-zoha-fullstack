"use server"

import { db } from "@/database/db";
import { cartTable } from "@/database/schemas/cart";
import { OrderInsert, OrderItemInsert, orderItemTable, orderTable } from "@/database/schemas/order";
import { productTable } from "@/database/schemas/product";
import { getUser } from "@/lib/auth/session";
import { getCartItems } from "@/lib/data/cart-data";
import { and, eq, gte, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";


export async function checkoutCart() {
    try {

        const user = await getUser(true)

        const { cartItems } = await getCartItems(false, user?.userId)

        if (cartItems.length === 0) {
            return {
                errorMessage: "Can't checkout with empty cart!"
            }
        }

        // start transaction, cart calculation and removing cart items, creating order and order items

        // calculate total price

        let totalPrice: number = 0.00
        let totalOrderItems: number = 0;


        for (let cartItemIndex = 0; cartItemIndex < cartItems.length; cartItemIndex++) {
            const cartItem = cartItems[cartItemIndex];

            const cartItemPrice = Number(cartItem.products?.price) * Number(cartItem.quantity!)
            totalPrice = totalPrice + cartItemPrice
            totalOrderItems = totalOrderItems + Number(cartItem.quantity)
        }

        await db.transaction(async (tx) => {
            // prepare order value
            const orderValue: OrderInsert = {
                totalOrderItems: totalOrderItems,
                discount: "0.00",
                orderUserId: user?.userId,
                isCompleted: false,
                totalAmount: totalPrice.toString(),
            }


            // create order 
            const orderRes = await tx.insert(orderTable).values(orderValue).returning({
                id: orderTable.id
            })

            // throw error and rollback if any changes happned
            if (!orderRes || orderRes.length === 0 || !orderRes[0].id) {
                tx.rollback()
            }

            // order items list
            const orderItemsList: OrderItemInsert[] = []

            // populate order items list
            cartItems.map((cartItem, index) => {
                const orderItemValue: OrderItemInsert = {
                    productName: cartItem.products?.name!,
                    price: cartItem.products?.price!,
                    quantity: cartItem.quantity!,
                    categoryName: cartItem.products?.category?.name!,
                    featuredImageKey: cartItem.products?.featuredImageKey!,
                    totalPrice: String(Number(cartItem.products?.price!) * Number(cartItem.quantity!)),
                    orderId: orderRes[0].id,
                    productId: cartItem.productId,
                    userId: user?.userId,
                }

                // push the order item in order item list
                orderItemsList.push(orderItemValue)



            })

            await tx.insert(orderItemTable).values(orderItemsList)

            await tx.delete(cartTable).where(eq(cartTable.userId, user?.userId!))

            for (const cartItem of cartItems) {
                if (!cartItem.productId) continue

                const orderQuantity = cartItem.quantity

                // update product stock quantity
                const productQuantityUpdateRes = await tx.update(productTable).set({
                    quantity: sql`${productTable.quantity} - ${orderQuantity}`
                }).where(and(
                    eq(productTable.id, cartItem.productId),
                    gte(productTable.quantity, orderQuantity!)
                )).returning({
                    id: productTable.id
                })


                if (!productQuantityUpdateRes || productQuantityUpdateRes.length === 0) {
                    tx.rollback()
                    return {
                        errorMessage: `${cartItem.products?.name!} in your cart are no longer available in the requested quantity.`
                    }
                }

                // update product details cache by slug
                updateTag(`productSlug-${cartItem.products?.slug!}`)

            }
        })

        // update cache
        updateTag(`cartItems-${user?.userId!}`)
        updateTag("productInventory")


        return {
            message: "Success"
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