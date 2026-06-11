'use server'

import * as z from "zod"
import { createCategoryFormState, CreateCategorySchema } from "@/lib/definitions";
import { bucketName, mediaClient } from "@/config/media-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/database/db";
import { categoryTable } from "@/database/schemas/category";


export async function uploadImageToPresignedUrl(formState: createCategoryFormState, formData: FormData) {

    // 1. Validate fields using the unified Zod schema
    const validatedFields = CreateCategorySchema.safeParse({
        name: formData.get("name"),
        desc: formData.get("desc"),
        image: formData.get("image"),
    })

    // 2. Return flat errors grouped by input field if validation fails
    if (!validatedFields.success) {
        return {
            success: false,
            errors: z.flattenError(validatedFields.error).fieldErrors,
            errorMessage: "Please fix the validation errors below."
        }
    }

    const { name, desc, image } = validatedFields.data

    // 2. Convert Web File API object into a Node.js Buffer
    const arrayBuffer = await image.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Create a unique clean key name
    const timestamp = Date.now()
    const cleanFileName = image.name.replace(/[^a-zA-Z0-9.]/g, "_")
    const s3Key = `categories/${timestamp}-${cleanFileName}`
    console.log(bucketName)

    // 3. Upload directly using the AWS SDK client
    try {

        await mediaClient.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: image.type || "application/octet-stream",
        }))

        const category: typeof categoryTable.$inferInsert = {
            name: name,
            desc: desc,
            imageKey: s3Key,
        }

        // create in database
        const createdCategoryRes = await db.insert(categoryTable).values(category).returning({
            id: categoryTable.id,
            name: categoryTable.name
        })

        return {
            message: `${createdCategoryRes[0].name} category has been created!`
        }


    } catch (error) {
        return {
            errorMessage: "Failed to create category!"
        }
    }

}