import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Collection from '@/lib/models/Collection'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

export async function GET() {
    try {
        await connectToDatabase()
        const items = await Collection.find({}).sort({ createdAt: -1 })
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
        const id = formData.get('id') as string
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const longDescription = formData.get('longDescription') as string
        const season = formData.get('season') as string
        const year = formData.get('year') as string

        const imageFile = formData.get('image') as File | null
        const heroImageFile = formData.get('heroImage') as File | null
        const galleryFiles = formData.getAll('gallery') as File[]

        const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'
        const endpoint = process.env.MINIO_ENDPOINT

        const uploadFile = async (file: File) => {
            if (!(file instanceof File)) return null
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
            return `https://${endpoint}/${minioBucket}/${uniqueFilename}`
        }

        let imageUrl = ''
        let heroImageUrl = ''
        const galleryUrls: string[] = []

        if (imageFile) imageUrl = await uploadFile(imageFile) || ''
        if (heroImageFile) heroImageUrl = await uploadFile(heroImageFile) || ''
        for (const file of galleryFiles) {
            const url = await uploadFile(file)
            if (url) galleryUrls.push(url)
        }

        const newDoc = new Collection({
            id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name,
            description,
            longDescription,
            season,
            year,
            image: imageUrl,
            heroImage: heroImageUrl,
            gallery: galleryUrls,
        })

        const saved = await newDoc.save()
        return NextResponse.json(saved, { status: 201 })
    } catch (error: any) {
        console.error('API POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
