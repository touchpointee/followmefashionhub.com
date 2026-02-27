import mongoose, { Schema, Document } from 'mongoose'

export interface ISiteContent extends Document {
    section: string
    data: any
    createdAt: Date
    updatedAt: Date
}

const SiteContentSchema: Schema = new Schema(
    {
        section: { type: String, required: true, unique: true },
        data: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
)

export default mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema)
