'use server'

import { db } from "@/database/db"
import { cartTable } from "@/database/schemas/cart"
import { OrderInsert, OrderItemInsert, orderItemTable, orderTable } from "@/database/schemas/order"
import { productTable } from "@/database/schemas/product"
import { usersTable } from "@/database/schemas/user"
import { getUser } from "@/lib/auth/session"
import { and, eq, gte, sql } from "drizzle-orm"
import { updateTag } from "next/cache"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"



const getSSLCommerzePaymentSession = async (totalAmount: number, currency?: string | null, tranId?: string, productNames?: string, quantity?: number, customerName?: string) => {
    const endpointUrl = process.env.SSL_COMMERZE_SESSION_API_ENDPOINT
    const store_id = process.env.SSL_COMMERZE_STORE_ID
    const store_pwd = process.env.SSL_COMMERZE_API_SECRET_KEY
    const successUrl = process.env.NEXT_PUBLIC_SSL_COMMERZE_SUCCESS_URL
    const failedUrl = process.env.NEXT_PUBLIC_SSL_COMMERZE_FAIL_URL
    const canceledUrl = process.env.NEXT_PUBLIC_SSL_COMMERZE_CANCEL_URL

    const formEncodedData = new FormData()

    formEncodedData.append("store_id", store_id || "")
    formEncodedData.append("store_passwd", store_pwd || "")
    formEncodedData.append("total_amount", totalAmount.toString())
    formEncodedData.append("currency", currency?.toUpperCase() || "BDT")
    formEncodedData.append("tran_id", tranId || "")
    formEncodedData.append("success_url", successUrl || "")
    formEncodedData.append("fail_url", failedUrl || "")
    formEncodedData.append("cancel_url", canceledUrl || "")
    formEncodedData.append("product_name", productNames || "")
    formEncodedData.append("num_of_item", quantity?.toString() || "")
    formEncodedData.append("cus_name", customerName || "")


    const res = await fetch(endpointUrl!, {
        method: "POST",
        body: formEncodedData,
    })

    const result = await res.json();

    return result
}



export async function sslCommerceCheckout(customShippingAddress: string) {

    try {

        const user = await getUser(true)
        const users = await db.select().from(usersTable).where(eq(usersTable.id, user?.userId!)).limit(1)

        if (!users || users.length === 0) {
            redirect("/auth/login")
        }

        const userDetails = users[0]


        let shippingAddress: string;


        if (customShippingAddress) {
            shippingAddress = customShippingAddress
        } else {
            if (!userDetails?.defaultShippingAddress) {
                return {
                    errorMessage: "Shipping address is missing!"
                }
            }
            shippingAddress = userDetails.defaultShippingAddress
        }


        const carts = await db.query.cartTable.findMany({
            with: {
                products: {
                    with: {
                        category: true
                    }
                }
            },
            where: {
                userId: user?.userId
            }
        })


        if (!carts || carts.length === 0) {
            return {
                errorMessage: "Add products in cart to checkout order!"
            }
        }


        let totalAmount: number = 0.00
        let totalOrderItems: number = 0
        let productNamesList: string[] = [];

        for (let index = 0; index < carts.length; index++) {

            const cartItem = carts[index];

            const totalItemPrice = Number(cartItem.quantity) * Number(cartItem.products?.price)
            totalAmount = totalAmount + totalItemPrice
            totalOrderItems = Number(cartItem.quantity) + totalOrderItems
            productNamesList.push(cartItem.products?.name!)
        }

        let productNames: string = productNamesList.join(",")

        let redirectPaymentGatewayUrl: string | null = null


        // start db transaction
        await db.transaction(async (tx) => {
            // prepare order value
            const orderValue: OrderInsert = {
                totalOrderItems: totalOrderItems,
                discount: "0.00",
                orderUserId: user?.userId,
                isCompleted: false,
                totalAmount: totalAmount.toString(),
                orderPaymentStatus: "due",
                orderPaymentMethod: "ssl_commerze_gateway",
                orderProcessStatus: "confirming",

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
            carts.map((cartItem, index) => {
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


            for (const cartItem of carts) {
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


            // generate ssl commerce 
            const gatewayRes = await getSSLCommerzePaymentSession(totalAmount, "BDT", orderRes[0].id, productNames, totalOrderItems, userDetails.firstName + " " + userDetails.lastName)

            if (!gatewayRes || !gatewayRes?.GatewayPageURL) {
                tx.rollback()
                return {
                    errorMessage: "Unable to place order due to payment gateway error! Please try again"
                }
            }

            redirectPaymentGatewayUrl = gatewayRes.GatewayPageURL

            // update cache
            updateTag(`cartItems-${user?.userId!}`)
            updateTag("productInventory")

        })

        if (redirectPaymentGatewayUrl) {
            redirect(redirectPaymentGatewayUrl!)
        } else {
            return {
                errorMessage: "Unknowen error happned!"
            }
        }




    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: "Unable to place the order. Try again!"
        }

    }



}