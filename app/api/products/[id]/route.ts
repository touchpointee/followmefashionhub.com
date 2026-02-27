import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        const product = await Product.findById(id)
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        const formData = await req.formData()

        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = formData.get('price') as string
        const stock = formData.get('stock') as string
        const status = formData.get('status') as string
        const currentImageUrl = formData.get('currentImageUrl') as string

        const imageFiles = formData.getAll('images') as File[]
        let uploadedImages: string[] = currentImageUrl ? [currentImageUrl] : []

        if (imageFiles && imageFiles.length > 0 && imageFiles[0] instanceof File) {
            await ensureBucketExists()
            const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'

            const file = imageFiles[0]
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

            // replace the existing image since this demo uses 1 image mostly
            uploadedImages = [publicUrl]
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                status,
                images: uploadedImages,
            },
            { new: true }
        )

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(updatedProduct)
    } catch (error: any) {
        console.error('API PATCH Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        await Product.findByIdAndDelete(id)
        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
