'use server'

import { db } from "@/database/db"
import { OrderProcessStatusType, orderTable } from "@/database/schemas/order"
import { usersTable } from "@/database/schemas/user"
import { getUser } from "@/lib/auth/session"
import { and, eq, or } from "drizzle-orm"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"

// update orders
export async function updateAdminOrder({
    orderId,
    action,
}: {
    orderId: string,
    action: OrderProcessStatusType
}) {

    try {
        const user = await getUser(true)

        const userDetails = await db.select().from(usersTable).where(and(
            eq(usersTable.id, user?.userId!),
            eq(usersTable.role, "admin")
        ))

        if (!userDetails) redirect("/")

        // update the order status
        const orderUpdateRes = await db.update(orderTable).set({
            orderProcessStatus: action,
        }).where(and(
            eq(orderTable.id, orderId),
            or(
                eq(orderTable.orderProcessStatus, "confirming"),
                eq(orderTable.orderProcessStatus, "processing"),
                eq(orderTable.orderProcessStatus, "confirmed"),
            )
        )).returning({
            id: orderTable.id
        })

        if (!orderUpdateRes || !orderUpdateRes[0]?.id) {
            throw Error("Unable to update the order! Try again")
        }

        return {
            message: "Order has been udpated!"
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        console.log(error)
        return {
            errorMessage: String(error) ?? "Something went wrong!"
        }
    }

}


// complete the order
export async function completeAdminOrder({
    orderId,

}: {
    orderId: string,
}) {

    try {
        const user = await getUser(true)

        const userDetails = await db.select().from(usersTable).where(and(
            eq(usersTable.id, user?.userId!),
            eq(usersTable.role, "admin")
        ))

        if (!userDetails) redirect("/")

        // update the order status
        const orderUpdateRes = await db.update(orderTable).set({
            isCompleted: true,
            orderPaymentStatus: "paid",
        }).where(and(
            eq(orderTable.id, orderId),
            and(
                eq(orderTable.orderProcessStatus, "confirmed"),
                eq(orderTable.isCompleted, false)
            )
        )).returning({
            id: orderTable.id
        })


        if (!orderUpdateRes || !orderUpdateRes[0]?.id) {
            throw Error("Unable to complete the order! Try again")
        }

        return {
            message: "Order has been completed!"
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        console.log(error)
        return {
            errorMessage: String(error) ?? "Something went wrong!"
        }
    }

}