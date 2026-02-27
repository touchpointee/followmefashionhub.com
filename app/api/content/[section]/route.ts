import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import SiteContent from '@/lib/models/SiteContent'

export async function GET(
    request: Request,
    { params }: { params: { section: string } }
) {
    try {
        await connectToDatabase()
        const content = await SiteContent.findOne({ section: params.section })
        return NextResponse.json(content ? content.data : {})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: { section: string } }
) {
    try {
        await connectToDatabase()

        // Accept pure JSON payloads for maximum flexibility with nested arrays
        const payload = await request.json()

        const updatedContent = await SiteContent.findOneAndUpdate(
            { section: params.section },
            { $set: { data: payload } },
            { new: true, upsert: true }
        )

        return NextResponse.json(updatedContent.data, { status: 200 })
    } catch (error: any) {
        console.error('API Content POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
