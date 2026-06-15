'use server'

import { db } from "@/database/db"
import { cartTable } from "@/database/schemas/cart"
import { getUser } from "@/lib/auth/session"
import { AddRemoveCartSchema } from "@/lib/types/definitions"
import { and, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"


// handle add and remove cart
export async function addRemoveCart(payload: {
    productId: string;
    cartId?: string;
    quantity?: number;
    actionType: "addToCart" | "removeFromCart" | "increment" | "decrement";
}) {

    try {

        // get user
        const user = await getUser()

        if (!user?.userId || !user) {
            return {
                errorMessage: "Authentication required!"
            }
        }

        const validatedFields = AddRemoveCartSchema.safeParse({ ...payload, userId: user.userId })

        if (validatedFields?.error) {
            return {
                errorMessage: "Validation failed!"
            }
        }

        const { productId, userId, quantity, actionType, cartId } = validatedFields.data

        if (!productId || !user.userId) return {
            errorMessage: "Invalid request!"
        }



        switch (actionType) {
            case "addToCart":

                // check if the product with active status with the user already exist in cart
                const isExist = await db.select().from(cartTable).where(and(eq(cartTable.userId, user.userId), eq(cartTable.productId, productId), eq(cartTable.isCompleted, false)))

                if (isExist && isExist.length > 0) {

                    const existingCart = isExist[0]

                    // update the existing cart
                    await db.update(cartTable).set({
                        quantity: sql`${cartTable.quantity} + 1`
                    }).where(and(eq(cartTable.id, existingCart.id), eq(cartTable.userId, user.userId), eq(cartTable.isCompleted, false), eq(cartTable.productId, existingCart.productId!)))


                    //  revalidate path to update the cart items
                    revalidatePath('/', 'layout')

                    return {
                        message: "Existing cart has been update."
                    }
                } else {

                    const item: typeof cartTable.$inferInsert = {
                        productId: productId,
                        quantity: quantity || 1,
                        isCompleted: false,
                        userId: userId
                    }

                    await db.insert(cartTable).values(item)

                    //  revalidate path to update the cart items
                    revalidatePath('/', 'layout')

                    return {
                        message: "Added to the cart."
                    }
                }

            case "removeFromCart":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }

                await db.delete(cartTable).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, user.userId), eq(cartTable.isCompleted, false)))

                //  revalidate path to update the cart items
                revalidatePath('/', 'layout')

                return {
                    message: "Removed from the cart."
                }
            case "increment":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }
                await db.update(cartTable).set({
                    quantity: sql`${cartTable.quantity} + 1`
                }).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, user.userId), eq(cartTable.isCompleted, false)))


                //  revalidate path to update the cart items
                revalidatePath('/', 'layout')

                return {
                    message: "Quantity increased."
                }
            case "decrement":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }
                await db.update(cartTable).set({
                    quantity: sql`GREATEST(${cartTable.quantity} - 1, 0)`
                }).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, user.userId), eq(cartTable.isCompleted, false)))

                //  revalidate path to update the cart items
                revalidatePath('/', 'layout')

                return {
                    message: "Quantity decreased."
                }
            default:
                return {
                    errorMessage: "Invalid request!"
                }
        }

    } catch (error) {
        return {
            errorMessage: "Unable tp perform cart actions! Try again"
        }
    }



}