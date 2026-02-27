import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import ContactMessage from '@/lib/models/ContactMessage'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await connectToDatabase()
        const messages = await ContactMessage.find().sort({ createdAt: -1 })
        return NextResponse.json(messages)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase()
        const data = await req.json()
        const message = await ContactMessage.create(data)
        return NextResponse.json(message, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
