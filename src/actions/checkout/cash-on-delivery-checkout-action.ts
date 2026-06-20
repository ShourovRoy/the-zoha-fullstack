'use server'

import { db } from "@/database/db";
import { cartTable } from "@/database/schemas/cart";
import { OrderInsert, orderTable } from "@/database/schemas/order";
import { productTable } from "@/database/schemas/product";
import { getUser, SessionPayload } from "@/lib/auth/session";
import { createJwt, OrderJwtPayload } from "@/lib/helpers/jwt-helper";
import { and, eq, gte, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";


export async function cashOneDeliveryCheckout({ pathName, customPhoneNumber, customShippingAddress }: {
    pathName: string;
    customPhoneNumber?: string;
    customShippingAddress?: string;
}) {




    try {
        let isSuccess : boolean = false
        let redirectToken: string | undefined

        // get current user
        const user = await getUser() as SessionPayload

        // user details
        const userDetails = await db.query.usersTable.findFirst({
            with: {
                carts: {
                    with: {
                        products: true,
                    }
                },
            },
            where: {
                id: {
                    eq: user?.userId
                }
            }
        })

        if (!userDetails) {
            redirect("/auth/login")
        }


        let shippingAddress: string;
        let contactNumber: string;

        if (customPhoneNumber) {
            contactNumber = customPhoneNumber;
        } else {
            contactNumber = userDetails.phoneNumber;
        }

        if (customShippingAddress) {
            shippingAddress = customShippingAddress;
        } else {
            shippingAddress = userDetails.defaultShippingAddress!;
        }


        let totalAmount: number = 0.00

        let totalItems: number = 0


        for (let cartItemIndex = 0; cartItemIndex < userDetails.carts.length; cartItemIndex++) {
            const cartItem = userDetails.carts[cartItemIndex];

            totalAmount = totalAmount + (Number(cartItem.quantity) * Number(cartItem.products?.price))
            totalItems = totalItems + Number(cartItem.quantity)

        }


        const orderValue: OrderInsert = {
            totalAmount: totalAmount.toString(),
            contactNumber,
            shippingAddress,
            isCompleted: false,
            discount: 0.00.toString(),
            orderUserId: user.userId,
            totalOrderItems: totalItems,
            orderPaymentChannel: "On delivery",
            orderPaymentMessage: "Will delivery on delivery",
            orderPaymentMethod: "cash_on_delivery",
            orderPaymentStatus: "due",
            orderProcessStatus: "confirming",
        }


        await db.transaction(async (tx) => {
            // create the order

            const [orderRes] = await tx.insert(orderTable).values(orderValue).returning({
                id: orderTable.id
            })

            if (!orderRes || !orderRes.id) {
                tx.rollback()
            }

            // remove the cart items
            await tx.delete(cartTable).where(eq(cartTable.userId, user.userId))

            // update the products quantity safely in inventory
            for (const cartItem of userDetails.carts) {
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
                revalidateTag(`productSlug-${cartItem.products?.slug!}`, "max")

            }

            // update the order is variable to create redirect token
            const redirectTokenRes = await createJwt<OrderJwtPayload>({
                userId: user.userId,
                orderId: orderRes.id,
            })

           
            redirectToken = redirectTokenRes
            isSuccess = true

        })
            .catch((err) => {
                console.log(err)

                return {
                    errorMessage: "Unable to place the order! Please try again."
                }
            })

        
        if(isSuccess && redirectToken) {
             const searchParams = new URLSearchParams({
                redirectToken: redirectToken
            })

            redirect(`${pathName}/success?${searchParams}`)
        }


    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        return {
            errorMessage: "Something went wrong! Please try again"
        }
    }

}