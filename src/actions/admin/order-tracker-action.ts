'use server'

import { db } from "@/database/db";
import { orderTrackerTable } from "@/database/schemas/order-tracker";
import { deleteSession, getUser } from "@/lib/auth/session";
import { getCurrentTimeDhaka } from "@/lib/helpers/time-helper";
import { AddOrderTrackingStepSchema, AddOrderTrackingStepState, CompleteOrderTrackerSchema, CompleterderTrackingState } from "@/lib/types/definitions";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as z from "zod"


// add steps in the tracker action
export async function addOrderTrackingStep(formState: AddOrderTrackingStepState, formData: FormData) {
    const validatedFields = AddOrderTrackingStepSchema.safeParse({
        stepDesc: formData.get("stepDesc"),
        orderTrackingId: formData.get("orderTrackingId")
    })

    if (validatedFields?.error || !validatedFields?.success) {
        return {
            success: false,
            errors: z.flattenError(validatedFields.error).fieldErrors,
            errorMessage: "Please fix the validation errors below."
        }
    }

    const { orderTrackingId, stepDesc } = validatedFields.data


    // get user session
    const userSession = await getUser()

    const userDetails = await db.query.usersTable.findFirst({
        columns: {
            password: false,
        },
        where: {
            id: {
                eq: userSession?.userId,
            },

        }
    })

    if (!userDetails) {
        await deleteSession()
        redirect("/auth/login/")
    }

    if (userDetails.role !== "admin") {
        redirect("/")
    }


    const updateRes = await db.update(orderTrackerTable).set({
        steps: sql`array_append(${orderTrackerTable.steps}, ${stepDesc})`
    }).where(and(eq(orderTrackerTable.id, orderTrackingId), eq(orderTrackerTable.isCompleted, false))).returning({
        id: orderTrackerTable.id
    })

    if (!updateRes || updateRes.length === 0 || !updateRes[0]?.id) {
        return {
            errorMessage: "Unable to add the steps"
        }
    }

    return {
        message: "Step added"
    }


}


// complete the tracker
export async function completeOrderTracker(state: CompleterderTrackingState, formData: FormData) {

    const validatedFields = CompleteOrderTrackerSchema.safeParse({
        otpCode: formData.get("otpCode"),
        orderTrackingId: formData.get("orderTrackingId")
    })



    if (validatedFields?.error || !validatedFields?.success) {
        return {
            success: false,
            errors: z.flattenError(validatedFields.error).fieldErrors,
            errorMessage: "Please fix the validation errors below."
        }
    }

    const { orderTrackingId, otpCode } = validatedFields.data


    // get user session
    const userSession = await getUser()

    const userDetails = await db.query.usersTable.findFirst({
        columns: {
            password: false,
        },
        where: {
            id: {
                eq: userSession?.userId,
            },

        }
    })

    if (!userDetails) {
        await deleteSession()
        redirect("/auth/login/")
    }

    if (userDetails.role !== "admin") {
        redirect("/")
    }


    // get the tracking details
    const updatedRes = await db.update(orderTrackerTable).set({
        isCompleted: true,
        steps: sql`array_append(${orderTrackerTable.steps}, 'Order has been delivered and closed at ' || ${getCurrentTimeDhaka()})`,
    }).where(and(
        eq(orderTrackerTable.id, orderTrackingId),
        eq(orderTrackerTable.isCompleted, false),
        eq(orderTrackerTable.otpCode, otpCode)
    )).returning({
        id: orderTrackerTable.id
    }).catch((err: any) => {

        console.log("erroro: ", String(err))

        return null
    })

    if (!updatedRes || updatedRes.length === 0 || !updatedRes[0]?.id) {
        return {
            errorMessage: "Unable to complete the tracking!"
        }
    }

    return {
        message: "Tracking has been completed."
    }

}