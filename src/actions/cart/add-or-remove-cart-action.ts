'use server'

import * as z from "zod";

import { db } from "@/database/db"
import { cartTable } from "@/database/schemas/cart"
import { AddRemoveCartSchema } from "@/lib/types/definitions"
import { and, eq, sql } from "drizzle-orm"


// handle add and remove cart
export async function addRemoveCart(payload: {
    userId: string;
    productId: string;
    cartId?: string;
    quantity?: number;
    actionType: "addToCart" | "removeFromCart" | "increment" | "decrement";
}) {

    try {

        const validatedFields = AddRemoveCartSchema.safeParse(payload)

        if (validatedFields?.error) {
            return {
                errors: "Validation failed!"
            }
        }

        const { productId, userId, quantity, actionType, cartId } = validatedFields.data



        if (!productId || !userId) return {
            errorMessage: "Invalid request!"
        }

        switch (actionType) {
            case "addToCart":

                const item: typeof cartTable.$inferInsert = {
                    productId: productId,
                    quantity: quantity || 1,
                    isCompleted: false,
                    userId: userId
                }

                await db.insert(cartTable).values(item)
                return {
                    message: "Added to the cart."
                }
            case "removeFromCart":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }

                await db.delete(cartTable).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, userId), eq(cartTable.isCompleted, false)))
                return {
                    message: "Removed from the cart."
                }
            case "increment":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }
                await db.update(cartTable).set({
                    quantity: sql`${cartTable.quantity} + 1`
                }).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, userId), eq(cartTable.isCompleted, false)))
                return {
                    message: "Quantity increased."
                }
            case "decrement":
                if (!cartId) return {
                    errorMessage: "Invalid request!"
                }
                await db.update(cartTable).set({
                    quantity: sql`GREATEST(${cartTable.quantity} - 1, 0)`
                }).where(and(eq(cartTable.id, cartId!), eq(cartTable.userId, userId), eq(cartTable.isCompleted, false)))
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