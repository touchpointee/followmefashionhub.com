'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function ImagePreview({ file, currentUrl }: { file: File | null, currentUrl?: string }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else if (currentUrl && currentUrl.trim() !== '' && currentUrl !== 'undefined' && currentUrl !== 'null') {
            setPreviewUrl(currentUrl)
        } else {
            setPreviewUrl(null)
        }
    }, [file, currentUrl])

    if (!previewUrl || error) return null

    return (
        <div className="mt-4 relative h-40 w-full max-w-sm rounded-lg overflow-hidden bg-muted border shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full"
                onError={() => setError(true)}
            />
        </div>
    )
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = React.use(params)

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        status: 'Active',
    })
    const [currentImageUrl, setCurrentImageUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`)
                if (!res.ok) throw new Error('Failed to fetch product')
                const data = await res.json()
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    price: data.price.toString(),
                    stock: data.stock.toString(),
                    status: data.status || 'Active'
                })
                if (data.images && data.images.length > 0) {
                    setCurrentImageUrl(data.images[0])
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setFetching(false)
            }
        }
        fetchProduct()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, status: value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('price', formData.price)
            data.append('stock', formData.stock)
            data.append('status', formData.status)

            if (currentImageUrl) {
                data.append('currentImageUrl', currentImageUrl)
            }

            if (imageFile) {
                data.append('images', imageFile)
            }

            const res = await fetch(`/api/products/${id}`, {
                method: 'PATCH',
                body: data,
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || 'Failed to update product')
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div>Loading...</div>

    return (
        <div className="flex justify-center max-w-2xl mx-auto w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Product</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" required value={formData.description} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" name="price" type="number" step="0.01" required value={formData.price} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input id="stock" name="stock" type="number" required value={formData.stock} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={handleSelectChange} value={formData.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Archived">Archived</SelectItem>
                                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Product Image</Label>
                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                            <ImagePreview file={imageFile} currentUrl={currentImageUrl} />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
