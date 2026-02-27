import { NextResponse } from 'next/server'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        await ensureBucketExists()

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'
        const buffer = Buffer.from(await file.arrayBuffer())
        const extension = file.name.split('.').pop()
        const uniqueFilename = `${crypto.randomUUID()}.${extension}`

        await minioClient.send(
            new PutObjectCommand({
                Bucket: minioBucket,
                Key: uniqueFilename,
                Body: buffer,
                ContentType: file.type,
            })
        )

        const endpoint = process.env.MINIO_ENDPOINT
        const publicUrl = `https://${endpoint}/${minioBucket}/${uniqueFilename}`

        return NextResponse.json({ url: publicUrl }, { status: 200 })
    } catch (error: any) {
        console.error('API Upload Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
