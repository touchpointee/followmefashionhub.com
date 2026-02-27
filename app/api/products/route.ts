import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { minioClient, ensureBucketExists } from '@/lib/minio'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

export async function GET() {
    try {
        await connectToDatabase()
        const products = await Product.find({}).sort({ createdAt: -1 })
        return NextResponse.json(products)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase()
        await ensureBucketExists()

        const formData = await request.formData()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const price = formData.get('price') as string
        const stock = formData.get('stock') as string
        const status = formData.get('status') as string || 'Active'
        const imageFiles = formData.getAll('images') as File[]

        const uploadedImages: string[] = []

        if (imageFiles && imageFiles.length > 0) {
            const minioBucket = process.env.MINIO_BUCKET_NAME || 'followmefashionhub'

            for (const file of imageFiles) {
                if (!(file instanceof File)) continue

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

                // Generate public URL based on MinIO endpoint and bucket
                const endpoint = process.env.MINIO_ENDPOINT
                const publicUrl = `https://${endpoint}/${minioBucket}/${uniqueFilename}`
                uploadedImages.push(publicUrl)
            }
        }

        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            status,
            images: uploadedImages,
        })

        const savedProduct = await newProduct.save()
        return NextResponse.json(savedProduct, { status: 201 })
    } catch (error: any) {
        console.error('API POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
