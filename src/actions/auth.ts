'use server'


import bcrypt from "bcryptjs";
import { SignupFormSchema, signupFormState } from "../lib/definitions";
import * as z from "zod"
import { db } from "@/database/db";
import { usersTable } from "@/database/schemas/user";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { eq, or } from "drizzle-orm";


export async function signup(formState: signupFormState, formData: FormData) {

    // validate the form fields
    const validatedFields = SignupFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    })

    // return error messages for invalid fields
    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors
        }
    }

    // data prepration
    const { firstName, lastName, email, password, confirmPassword, phoneNumber } = validatedFields.data

    // check the password and confirm password
    if (password !== confirmPassword) {
        return {
            errorMessage: "Password & Confirm password are not matching!"
        }
    }


    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    try {

        const existingUser = await db
            .select()
            .from(usersTable)
            .where(
                or(
                    eq(usersTable.email, email),
                    eq(usersTable.phoneNumber, phoneNumber)
                )
            )
            .limit(1);

        if (existingUser.length > 0) {
            const user = existingUser[0];

            // Determine exactly which field is duplicated to send targeted UI feedback
            const errors: Record<string, string[]> = {};
            if (user.email === email) {
                errors.email = ["An account with this email already exists."];
            }
            if (user.phoneNumber === phoneNumber) {
                errors.phoneNumber = ["This mobile number is already in use."];
            }

            return { errors };
        }

        // insert the data inside database
        const data = await db.insert(usersTable).values({
            firstName, lastName, email, password: hashedPassword, phoneNumber, role: "customer"
        }).returning({
            id: usersTable.id
        })

        const user = data[0]

        if (!user) {
            return {
                errorMessage: "Signup failed! Try again."
            }
        }


        // create session

        await createSession(user.id, "customer")

        redirect("/")

    } catch (error) {
        console.log(String(error))
        return {
            errorMessage: "Something went wrong!"
        }
    }

}


export async function logout() {
    await deleteSession()
    redirect('/auth/login')
}