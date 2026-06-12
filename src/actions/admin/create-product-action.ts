'use server'
import * as z from "zod"
import { createProductFormState, CreateProductSchema } from "@/lib/types/definitions";
import { bucketName, mediaClient } from "@/config/media-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { productImageTable, productTable } from "@/database/schemas/product";
import { db } from "@/database/db";
import { updateTag } from "next/cache";

export interface ImageGallaryInterface {
    imageKey: string
    productId: string
}

export async function transformFileIntoBuffer(file: File) {
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    return fileBuffer
}

export async function createUniqueFileName(file: File, dir: string) {
    const timestamp = Date.now()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_")
    const s3Key = `${dir}/${timestamp}-${cleanFileName}`

    return s3Key
}




export async function createProduct(formState: createProductFormState, formData: FormData): Promise<createProductFormState> {

    // 1. Extract and validate fields cleanly
    const validatedFields = CreateProductSchema.safeParse({
        name: formData.get("name"),
        shortDesc: formData.get("shortDesc"),
        price: Number(formData.get("price")),
        desc: formData.get("desc"),
        quantity: Number(formData.get("quantity")),
        thresholdQuantity: Number(formData.get("thresholdQuantity")),
        categoryId: formData.get("categoryId"),
        featuredImageKey: formData.get("featuredImageKey"), // Make sure this matches your input's "name" attribute!
        gallaryImages: formData.getAll("galleryImages"), // Gets ALL files from the multiple upload block as an array
    })

    // 2. Return flat errors matched against our updated createProductFormState type shape
    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            errorMessage: "Please fix the validation errors below."
        }
    }

    // 3. Database operations go here...
    const { featuredImageKey, categoryId, desc, name, shortDesc, gallaryImages, price, quantity, thresholdQuantity } = validatedFields.data


    // convert featured image to buffer
    const featuredImageBurffer = await transformFileIntoBuffer(featuredImageKey)

    // generate unique name for featured image
    const featuredImageS3Key = await createUniqueFileName(featuredImageKey, "products")

    try {

        // upload featured image to s3
        await mediaClient.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: featuredImageS3Key,
            Body: featuredImageBurffer,
            ContentType: featuredImageKey.type || "application/octet-stream",
        }))

        // prepare db product data
        const productValue: typeof productTable.$inferInsert = {
            name, featuredImageKey: featuredImageS3Key, shortDesc, categoryId, desc, price: price.toString(), quantity, thresholdQuantity
        }

        // save product in db
        const productRes = await db.insert(productTable).values(productValue).returning({
            id: productTable.id
        })

        if (productRes.length < 1) {
            return {
                errorMessage: "Unable to upload product please try again!"
            }
        }

        const productId = productRes[0].id


        // store the s3keys in the list to save in db
        let productGallaryDataList: ImageGallaryInterface[] = []

        // upload all the images to s3
        for (let gallaryImage = 0; gallaryImage < gallaryImages.length; gallaryImage++) {
            const imgFile = gallaryImages[gallaryImage];

            // convert the file into buffer
            const bufferedImg = await transformFileIntoBuffer(imgFile)

            // generate a img file unique key name
            const s3Key = await createUniqueFileName(imgFile, "products")

            // upload the file into s3
            await mediaClient.send(new PutObjectCommand({
                Bucket: bucketName,
                Key: s3Key,
                Body: bufferedImg,
                ContentType: imgFile.type || "application/octet-stream",
            })).then(() => {

                const gallaryImgValue: ImageGallaryInterface = {
                    imageKey: s3Key,
                    productId: productId,
                }

                productGallaryDataList.push(gallaryImgValue)

            })

        }


        await db.insert(productImageTable).values(productGallaryDataList)


        updateTag('productInventory')


        return {
            message: "Product asset saved successfully to storefront registry."
        }

    } catch (error) {

        console.log(error)
        return {
            errorMessage: "Failed to upload product!"
        }
    }

}