import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Journal from '@/lib/models/Journal'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

export async function GET() {
    try {
        await connectToDatabase()
        const items = await Journal.find({}).sort({ createdAt: -1 })
        return NextResponse.json(items)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase()
        await ensureBucketExists()

        const formData = await request.formData()
        const slug = formData.get('slug') as string
        const title = formData.get('title') as string
        const excerpt = formData.get('excerpt') as string
        const content = formData.get('content') as string
        const category = formData.get('category') as string
        const author = formData.get('author') as string
        const date = formData.get('date') as string
        const readTime = formData.get('readTime') as string

        const imageFile = formData.get('image') as File | null

        const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'
        const endpoint = process.env.MINIO_ENDPOINT

        let imageUrl = ''
        if (imageFile instanceof File) {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const extension = imageFile.name.split('.').pop()
            const uniqueFilename = `${crypto.randomUUID()}.${extension}`
            await minioClient.send(
                new PutObjectCommand({
                    Bucket: minioBucket,
                    Key: uniqueFilename,
                    Body: buffer,
                    ContentType: imageFile.type,
                })
            )
            imageUrl = `https://${endpoint}/${minioBucket}/${uniqueFilename}`
        }

        const newDoc = new Journal({
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title,
            excerpt,
            content,
            category,
            author,
            date,
            readTime,
            image: imageUrl,
        })

        const saved = await newDoc.save()
        return NextResponse.json(saved, { status: 201 })
    } catch (error: any) {
        console.error('API POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
