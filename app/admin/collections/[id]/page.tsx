'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from 'next/link'

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

export default function EditCollection({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = React.use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [currentImages, setCurrentImages] = useState({ image: '', heroImage: '', gallery: [] as string[] })
    const [images, setImages] = useState<{ main: File | null, hero: File | null, gallery: (File | null)[] }>({
        main: null,
        hero: null,
        gallery: [null, null, null, null, null, null]
    })
    const [formDataState, setFormDataState] = useState({
        name: '', season: '', year: '', description: '', longDescription: ''
    })

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const res = await fetch(`/api/collections/${id}`)
                if (!res.ok) throw new Error('Collection not found')
                const data = await res.json()
                setFormDataState({
                    name: data.name || '',
                    season: data.season || '',
                    year: data.year || '',
                    description: data.description || '',
                    longDescription: data.longDescription || ''
                })
                setCurrentImages({
                    image: data.image || '',
                    heroImage: data.heroImage || '',
                    gallery: data.gallery || []
                })
            } catch (err: any) {
                alert(err.message)
            } finally {
                setFetching(false)
            }
        }
        fetchCollection()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.set('currentImage', currentImages.image)
        formData.set('currentHeroImage', currentImages.heroImage)

        if (images.main) formData.set('image', images.main)
        if (images.hero) formData.set('heroImage', images.hero)

        for (let i = 0; i < 6; i++) {
            if (images.gallery[i]) formData.append(`gallery_${i}`, images.gallery[i] as File)
            else if (currentImages.gallery[i]) formData.append(`gallery_${i}`, currentImages.gallery[i])
            else formData.append(`gallery_${i}`, '')
        }

        try {
            const res = await fetch(`/api/collections/${id}`, {
                method: 'PATCH',
                body: formData
            })

            if (res.ok) {
                router.push('/admin/collections')
                router.refresh()
            } else {
                const text = await res.text()
                throw new Error(text)
            }
        } catch (error: any) {
            console.error('Failed to update collection', error)
            alert('Failed to save collection: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div>Loading...</div>

    return (
        <div className="flex flex-col gap-6 max-w-4xl pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input name="name" required value={formDataState.name} onChange={e => setFormDataState(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Season</label>
                                <Input name="season" required value={formDataState.season} onChange={e => setFormDataState(p => ({ ...p, season: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input name="year" required value={formDataState.year} onChange={e => setFormDataState(p => ({ ...p, year: e.target.value }))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Description</label>
                            <Input name="description" required value={formDataState.description} onChange={e => setFormDataState(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Long Description (Vision)</label>
                            <Textarea name="longDescription" required value={formDataState.longDescription} onChange={e => setFormDataState(p => ({ ...p, longDescription: e.target.value }))} rows={6} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image</label>
                            <Input type="file" onChange={(e) => setImages(prev => ({ ...prev, main: e.target.files?.[0] || null }))} accept="image/*" />
                            <ImagePreview file={images.main} currentUrl={currentImages.image} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Image</label>
                            <Input type="file" onChange={(e) => setImages(prev => ({ ...prev, hero: e.target.files?.[0] || null }))} accept="image/*" />
                            <ImagePreview file={images.hero} currentUrl={currentImages.heroImage} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium border-b pb-2">Lookbook Gallery (6 Images)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[0, 1, 2, 3, 4, 5].map((idx) => (
                                    <div key={idx} className="space-y-2 border p-4 rounded bg-muted/20">
                                        <label className="text-sm font-medium">Gallery Image {idx + 1}</label>
                                        <Input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null
                                                setImages(prev => {
                                                    const newGallery = [...prev.gallery]
                                                    newGallery[idx] = file
                                                    return { ...prev, gallery: newGallery }
                                                })
                                            }}
                                            accept="image/*"
                                        />
                                        <ImagePreview file={images.gallery[idx]} currentUrl={currentImages.gallery[idx]} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/collections">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Collection'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
