import 'server-only'

export const getAssetUrl = (key: string) => {
   
    if (key.startsWith('http')) return key
    return `${process.env.NEXT_PUBLIC_S3_MEDIA_DOMAIN}/${key}`
}