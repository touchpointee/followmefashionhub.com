import mongoose, { Schema, Document } from 'mongoose'

export interface ICollection extends Document {
    id: string
    name: string
    description: string
    longDescription: string
    image: string
    heroImage: string
    gallery: string[]
    season: string
    year: string
    createdAt: Date
    updatedAt: Date
}

const CollectionSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        longDescription: { type: String, required: true },
        image: { type: String },
        heroImage: { type: String },
        gallery: [{ type: String }],
        season: { type: String },
        year: { type: String },
    },
    { timestamps: true }
)

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema)
