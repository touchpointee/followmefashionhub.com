import mongoose, { Schema, Document } from 'mongoose'

export interface IJournal extends Document {
    slug: string
    title: string
    excerpt: string
    content: string
    image: string
    date: string
    category: string
    author: string
    readTime: string
    createdAt: Date
    updatedAt: Date
}

const JournalSchema: Schema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        excerpt: { type: String },
        content: { type: String, required: true },
        image: { type: String },
        date: { type: String },
        category: { type: String },
        author: { type: String },
        readTime: { type: String },
    },
    { timestamps: true }
)

export default mongoose.models.Journal || mongoose.model<IJournal>('Journal', JournalSchema)
