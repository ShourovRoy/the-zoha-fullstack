'use server'

import { db } from "@/database/db";
import { orderTrackerTable } from "@/database/schemas/order-tracker";
import { deleteSession, getUser } from "@/lib/auth/session";
import { AddOrderTrackingStepSchema, AddOrderTrackingStepState } from "@/lib/types/definitions";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import * as z from "zod"

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