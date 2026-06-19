import 'server-only'
import {
  S3Client,
} from "@aws-sdk/client-s3";


export const bucketName: string = process.env.S3_BUCKET_NAME || ""

export const mediaClient = new S3Client({
  region: process.env.S3_BUCKET_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});