import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import ContactMessage from '@/lib/models/ContactMessage'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        const body = await req.json()
        const result = await ContactMessage.findByIdAndUpdate(id, body, { new: true })
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        await ContactMessage.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
