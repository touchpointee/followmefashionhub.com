import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Journal from '@/lib/models/Journal'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import mongoose from 'mongoose'

// Only include _id in the query when the id is a valid MongoDB ObjectId
function buildQuery(id: string) {
    const conditions: any[] = [{ slug: id }]
    if (mongoose.Types.ObjectId.isValid(id)) conditions.push({ _id: id })
    return { $or: conditions }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectToDatabase()
        const journal = await Journal.findOne(buildQuery(id))
        if (!journal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(journal)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectToDatabase()

        const formData = await request.formData()
        const title = formData.get('title') as string
        const category = formData.get('category') as string
        const date = formData.get('date') as string
        const author = formData.get('author') as string
        const readTime = formData.get('readTime') as string
        const excerpt = formData.get('excerpt') as string
        const content = formData.get('content') as string

        const existingImg = formData.get('currentImage') as string
        const imageFile = formData.get('image') as File | null

        let finalImage = existingImg

        if (imageFile && imageFile instanceof File) {
            await ensureBucketExists()
            const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'
            const endpoint = process.env.MINIO_ENDPOINT

            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const extension = imageFile.name.split('.').pop()
            const uniqueFilename = `${crypto.randomUUID()}.${extension}`

            await minioClient.send(
                new PutObjectCommand({
                    Bucket: minioBucket,
                    Key: uniqueFilename,
                    Body: buffer,
                    ContentType: imageFile.type
                })
            )
            finalImage = `https://${endpoint}/${minioBucket}/${uniqueFilename}`
        }

        const newSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        const updatedJournal = await Journal.findOneAndUpdate(
            buildQuery(id),
            {
                title,
                slug: newSlug,
                category,
                date,
                author,
                readTime,
                excerpt,
                content,
                image: finalImage,
            },
            { new: true }
        )

        if (!updatedJournal) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        return NextResponse.json(updatedJournal)
    } catch (error: any) {
        console.error('API PATCH Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await connectToDatabase()
        await Journal.findOneAndDelete(buildQuery(id))
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
