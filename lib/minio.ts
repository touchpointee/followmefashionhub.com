import { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3'

export const minioClient = new S3Client({
    endpoint: `https://${process.env.MINIO_ENDPOINT}`,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || '',
        secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    },
    forcePathStyle: true, // Needed for MinIO
})

export async function ensureBucketExists() {
    const bucketName = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'

    try {
        await minioClient.send(new HeadBucketCommand({ Bucket: bucketName }))
    } catch (error: any) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            try {
                await minioClient.send(new CreateBucketCommand({ Bucket: bucketName }))
                console.log(`Bucket ${bucketName} created successfully.`)
            } catch (err) {
                console.error('Error creating bucket:', err)
            }
        } else {
            console.error('Error checking bucket:', error)
        }
    }
}
