import 'server-only'

import { db } from "@/database/db"
import { cartTable } from "@/database/schemas/cart"
import { count, eq } from "drizzle-orm"
import { cacheLife, cacheTag } from 'next/cache'
import { getUser } from '../auth/session'
import { CartItemList } from '../types/custom-definitions'
import { redirect } from 'next/navigation'



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
                eq(cartTable.userId, userId),
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
export async function getCartItems(redirectUnauthenticated?: boolean, userRefId?: string) {

    let userId: string;

    // if user id is provided no need to call getUser
    if (!userRefId) {
        const user = await getUser(redirectUnauthenticated)
        userId = user?.userId!;
    } else {
        userId = userRefId
    }


    if (!userId) {

        if (redirectUnauthenticated) {
            redirect("/auth/login")

        } else {
            return {
                cartItems: []
            }
        }
    }


    const res = await getCartCachedItems(userId)


    return {
        cartItems: res
    }




}