import 'server-only'

import { db } from "@/database/db"
import { cartTable } from "@/database/schemas/cart"
import { and, count, eq } from "drizzle-orm"
import { cacheLife, cacheTag } from 'next/cache'
import { getUser } from '../auth/session'
import { CartItemList } from '../types/custom-definitions'



// get cart items
export async function getCartItemNumber(userId: string | null) {

    'use cache'

    cacheTag("cartCount")
    cacheLife("seconds")

    try {

        if (!userId) throw new Error("User not authenticated!")

        const [result] = await db
            .select({
                totalItems: count(),
            })
            .from(cartTable)
            .where(
                and(
                    eq(cartTable.userId, userId),
                    eq(cartTable.isCompleted, false)
                )
            );
        const cartCount = result?.totalItems ?? 0;

        return {
            cartCount
        }
    } catch (error) {
        return {
            cartCount: 0
        }
    }
}


// get all cart items with cache
export async function getCartCachedItems(userId: string) {

    'use cache'

    cacheTag(`cartItems-${userId}`)
    cacheLife("minutes")


    try {

        const cartItems = await db.query.cartTable.findMany({
            with: {
                products: {
                    with: {
                        category: true
                    }
                }
            },
            where: {
                userId: {
                    eq: userId
                },
                isCompleted: {
                    eq: false,
                }
            },
            orderBy: {
                created_at: "asc"
            }
        })


        if (cartItems) {
            return cartItems as CartItemList
        }


        return []


    } catch (error) {
        return []
    }
}

// get all dynamic cart items with auth
export async function getCartItems() {

    try {
        const user = await getUser()

        if (!user || !user.userId) return {
            cartItems: []
        }


        const res = await getCartCachedItems(user.userId)

        return {
            cartItems: res
        }


    } catch (error) {
        return {
            cartItems: []
        }
    }

}