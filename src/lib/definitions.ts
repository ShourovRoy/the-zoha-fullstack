import * as z from 'zod'


export const SignupFormSchema = z.object({
    firstName: z
        .string()
        .min(2, { error: 'First Name must be at least 2 characters long.' })
        .trim(),
    lastName: z
        .string()
        .min(2, { error: 'Last Name must be at least 2 characters long.' })
        .trim(),

    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    phoneNumber: z.string({ error: 'Invalid Phone number' }).min(10).max(15).trim(),
    password: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            error: 'Contain at least one special character.',
        })
        .trim(),
    confirmPassword: z
        .string()
        .min(8, { error: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        .regex(/[0-9]/, { error: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            error: 'Contain at least one special character.',
        })
        .trim(),
})

export type signupFormState =
    | {
        errors?: {
            firstName?: string[]
            lastName?: string[]
            phoneNumber?: string[]
            confirmPasswrod?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
        errorMessage?: string
    }
    | undefined


// login state
export const LoginFormSchema = z.object({

    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z.string({ error: "Invalid!" })
})

// login form state
export type loginFormState =
    | {
        errors?: {
            email?: string[]
            password?: string[]
        }
        message?: string
        errorMessage?: string
    }
    | undefined;


// image uploader
// Configuration constants for file limits
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreateCategorySchema = z.object({
    name: z
        .string()
        .min(3, { message: "Category name must be at least 3 characters long." })
        .trim(),

    desc: z.string(),

    image: z
        .instanceof(File, { message: "A category image thumbnail is required." })

})


export type createCategoryFormState =
    | {
        errors?: {
            name?: string[]
            desc?: string[]
            image?: string[]
        }
        errorMessage?: string
        message?: string
        imageUrl?: string
    }
    | undefined;