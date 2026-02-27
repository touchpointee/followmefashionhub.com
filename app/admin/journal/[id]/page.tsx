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

export default function EditJournal({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = React.use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [currentImage, setCurrentImage] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [formDataState, setFormDataState] = useState({
        title: '', category: '', date: '', author: '', readTime: '', excerpt: '', content: ''
    })

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/journal/${id}`)
                if (!res.ok) throw new Error('Article not found')
                const data = await res.json()
                setFormDataState({
                    title: data.title || '',
                    category: data.category || '',
                    date: data.date || '',
                    author: data.author || '',
                    readTime: data.readTime || '',
                    excerpt: data.excerpt || '',
                    content: data.content || ''
                })
                setCurrentImage(data.image || '')
            } catch (err: any) {
                alert(err.message)
            } finally {
                setFetching(false)
            }
        }
        fetchArticle()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.set('currentImage', currentImage)
        if (image) formData.set('image', image)

        try {
            const res = await fetch(`/api/journal/${id}`, {
                method: 'PATCH',
                body: formData
            })

            if (res.ok) {
                router.push('/admin/journal')
                router.refresh()
            } else {
                throw new Error(await res.text())
            }
        } catch (error: any) {
            console.error('Failed to update article', error)
            alert('Failed to save article.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div>Loading...</div>

    return (
        <div className="flex flex-col gap-6 max-w-4xl pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/journal">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Article Meta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input name="title" required value={formDataState.title} onChange={e => setFormDataState(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input name="category" required value={formDataState.category} onChange={e => setFormDataState(p => ({ ...p, category: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input name="date" required value={formDataState.date} onChange={e => setFormDataState(p => ({ ...p, date: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author</label>
                                <Input name="author" required value={formDataState.author} onChange={e => setFormDataState(p => ({ ...p, author: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Read Time</label>
                                <Input name="readTime" required value={formDataState.readTime} onChange={e => setFormDataState(p => ({ ...p, readTime: e.target.value }))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excerpt</label>
                            <Textarea name="excerpt" required value={formDataState.excerpt} onChange={e => setFormDataState(p => ({ ...p, excerpt: e.target.value }))} rows={2} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Main Content (Markdown-like tags allowed)</label>
                            <Textarea name="content" required value={formDataState.content} onChange={e => setFormDataState(p => ({ ...p, content: e.target.value }))} rows={12} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image</label>
                            <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
                            <ImagePreview file={image} currentUrl={currentImage} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/journal">
                        <Button variant="outline" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Article'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
