"use client"

import { useState, useEffect } from 'react'
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


export default function NewCollection() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<{ main: File | null, hero: File | null, gallery: (File | null)[] }>({
        main: null,
        hero: null,
        gallery: [null, null, null, null, null, null]
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        if (images.main) formData.set('image', images.main)
        if (images.hero) formData.set('heroImage', images.hero)
        for (let i = 0; i < 6; i++) {
            if (images.gallery[i]) formData.append(`gallery_${i}`, images.gallery[i] as File)
            else formData.append(`gallery_${i}`, '')
        }

        try {
            const res = await fetch('/api/collections', {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                router.push('/admin/collections')
            } else {
                throw new Error(await res.text())
            }
        } catch (error) {
            console.error('Failed to create collection', error)
            alert('Failed to save collection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New Collection</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input name="name" required placeholder="Spring Awakening" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Season</label>
                                <Input name="season" required placeholder="Spring/Summer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input name="year" required placeholder="2026" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Short Description</label>
                            <Input name="description" required placeholder="Light and airy styles for spring." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Long Description (Vision)</label>
                            <Textarea name="longDescription" required placeholder="Paragraphs separated by blank newlines..." rows={6} />
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
                            <ImagePreview file={images.main} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Image</label>
                            <Input type="file" onChange={(e) => setImages(prev => ({ ...prev, hero: e.target.files?.[0] || null }))} accept="image/*" />
                            <ImagePreview file={images.hero} />
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
                                        <ImagePreview file={images.gallery[idx]} />
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
