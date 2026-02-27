import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Collection from '@/lib/models/Collection'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import mongoose from 'mongoose'

// Build a safe query: try both the custom 'id' slug and MongoDB '_id' (only if valid ObjectId)
function buildQuery(id: string) {
    const conditions: any[] = [{ id }]
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
        // Find by custom 'id' slug, or by MongoDB '_id' if id looks like an ObjectId
        const collection = await Collection.findOne(buildQuery(id))
        if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(collection)
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
        await ensureBucketExists()

        const formData = await request.formData()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const longDescription = formData.get('longDescription') as string
        const season = formData.get('season') as string
        const year = formData.get('year') as string

        const existingImg = formData.get('currentImage') as string
        const existingHero = formData.get('currentHeroImage') as string
        const imageFile = formData.get('image') as File | null
        const heroFile = formData.get('heroImage') as File | null

        const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'
        const endpoint = process.env.MINIO_ENDPOINT

        let finalImage = existingImg
        let finalHero = existingHero

        // Helper function to upload an image
        const uploadImage = async (file: File) => {
            if (!(file instanceof File)) return null
            const buffer = Buffer.from(await file.arrayBuffer())
            const extension = file.name.split('.').pop()
            const uniqueFilename = `${crypto.randomUUID()}.${extension}`
            await minioClient.send(new PutObjectCommand({ Bucket: minioBucket, Key: uniqueFilename, Body: buffer, ContentType: file.type }))
            return `https://${endpoint}/${minioBucket}/${uniqueFilename}`
        }

        if (imageFile) {
            const uploaded = await uploadImage(imageFile)
            if (uploaded) finalImage = uploaded
        }

        if (heroFile) {
            const uploaded = await uploadImage(heroFile)
            if (uploaded) finalHero = uploaded
        }

        let finalGallery: string[] = []
        for (let i = 0; i < 6; i++) {
            const item = formData.get(`gallery_${i}`)
            if (item instanceof File && item.size > 0 && item.name !== 'empty.txt') {
                const url = await uploadImage(item)
                if (url) finalGallery.push(url)
                else finalGallery.push('')
            } else if (typeof item === 'string' && item.trim() !== '') {
                finalGallery.push(item)
            } else {
                finalGallery.push('')
            }
        }

        let idToUpdate = id
        // In this db, name usually determines the lowercase 'id'. We update the custom 'id' if 'name' changes.
        const updatedCustomId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

        const updatedCollection = await Collection.findOneAndUpdate(
            buildQuery(idToUpdate),
            {
                name,
                id: updatedCustomId,
                description,
                longDescription,
                season,
                year,
                image: finalImage,
                heroImage: finalHero,
                gallery: finalGallery
            },
            { new: true }
        )

        if (!updatedCollection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 })

        return NextResponse.json(updatedCollection)
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
        await Collection.findOneAndDelete(buildQuery(id))
        return NextResponse.json({ message: 'Deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
