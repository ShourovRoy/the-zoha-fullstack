import 'server-only'

import { bucketName, mediaClient } from "@/config/media-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";





export async function createPreSignupUrlPutCommand({ key, expiresIn }: {
    key: string,
    expiresIn: number
}) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
    })
    return getSignedUrl(mediaClient, command, { expiresIn })
}
