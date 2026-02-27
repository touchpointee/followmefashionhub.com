import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
    name: string
    description: string
    price: number
    stock: number
    status: string
    images: string[]
    createdAt: Date
    updatedAt: Date
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        status: {
            type: String,
            required: true,
            enum: ['Active', 'Draft', 'Archived', 'Out of Stock'],
            default: 'Active'
        },
        images: [{ type: String }],
    },
    { timestamps: true }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
