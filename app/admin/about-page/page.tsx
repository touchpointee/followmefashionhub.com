'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

// Generic helper to upload a single file
async function uploadFile(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('File upload failed')
    const data = await res.json()
    return data.url
}

// Generic helper to save section JSON
async function saveSection(section: string, data: any) {
    const res = await fetch(`/api/content/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`Failed to save ${section}`)
    return await res.json()
}

function ImagePreview({ file, currentUrl }: { file: File | null, currentUrl?: string }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else if (currentUrl) {
            setPreviewUrl(currentUrl)
        } else {
            setPreviewUrl(null)
        }
    }, [file, currentUrl])

    if (!previewUrl) return null

    return (
        <div className="mt-2 relative h-32 w-48 rounded-md overflow-hidden bg-muted border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
        </div>
    )
}

function AboutPageSettings() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // ABOUT PAGE CONTENT STATE
    const [aboutPageData, setAboutPageData] = useState({
        hero: {
            title: 'About Us',
            subtitle: 'Our Story',
            image: '/images/about-hero.jpg'
        },
        story: {
            titlePart1: 'Where Passion Meets ',
            titlePart2: 'Purpose',
            content: 'Follow Me Fashion Hub was born from a simple belief: that fashion should be a form of self-expression accessible to everyone who values quality and design.\n\nFounded in 2020, our brand emerged during a time when the world was reimagining what truly matters. We set out to create clothing that would become trusted companions in our customers lives—pieces that inspire confidence and stand the test of time.\n\nToday, we continue to honor that founding vision, designing collections that blend contemporary aesthetics with timeless elegance. Every garment we create is a testament to our commitment to quality, sustainability, and the art of dressing well.',
            image: '/images/about-brand.jpg'
        },
        values: {
            badge: 'What We Believe',
            title: 'Our Values',
            items: [
                { title: 'Quality', description: 'We believe in creating garments that last. Every stitch, every seam, every detail is crafted with precision and care.' },
                { title: 'Sustainability', description: 'Our commitment to the environment guides our material choices and production processes, ensuring fashion that respects our planet.' },
                { title: 'Timelessness', description: 'We design pieces that transcend trends, offering enduring style that remains relevant season after season.' },
                { title: 'Craftsmanship', description: 'Our skilled artisans bring decades of experience to every garment, honoring traditional techniques while embracing innovation.' }
            ]
        },
        team: {
            badge: 'The People',
            title: 'Behind Every Design',
            content: 'Our team is a diverse collective of designers, artisans, and visionaries who share a common passion for fashion and excellence.\n\nFrom our design studio to our production facilities, every member of the Follow Me Fashion Hub family contributes their unique expertise to bring our collections to life.\n\nWe believe that great fashion is the result of great collaboration, and we are proud to work with some of the most talented individuals in the industry.',
            image: '/images/team.jpg'
        }
    })
    const [aboutPageHeroFile, setAboutPageHeroFile] = useState<File | null>(null)
    const [aboutPageStoryFile, setAboutPageStoryFile] = useState<File | null>(null)
    const [aboutPageTeamFile, setAboutPageTeamFile] = useState<File | null>(null)

    useEffect(() => {
        async function loadData() {
            try {
                const apRes = await fetch('/api/content/aboutPage')
                if (apRes.ok) { const d = await apRes.json(); if (Object.keys(d).length > 0) setAboutPageData(p => ({ ...p, ...d })) }
            } catch (e) {
                console.error('Failed to load content', e)
            }
        }
        loadData()
    }, [])

    const wrapSubmit = async (fn: () => Promise<void>, successMsg: string) => {
        setLoading(true); setMessage('')
        try {
            await fn()
            setMessage(successMsg)
        } catch (err: any) { setMessage(`Error: ${err.message}`) }
        finally { setLoading(false) }
    }

    const handleAboutPageSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...aboutPageData }
            if (aboutPageHeroFile) payload.hero.image = await uploadFile(aboutPageHeroFile)
            if (aboutPageStoryFile) payload.story.image = await uploadFile(aboutPageStoryFile)
            if (aboutPageTeamFile) payload.team.image = await uploadFile(aboutPageTeamFile)
            await saveSection('aboutPage', payload)
        }, 'About Page details updated successfully!')
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">About Us Page</h1>
                <p className="text-muted-foreground">Manage the content specifically for the About Us page.</p>
            </div>

            {message && <p className="text-emerald-600 font-medium">{message}</p>}

            <Card>
                <form onSubmit={handleAboutPageSubmit}>
                    <CardHeader>
                        <CardTitle>About Page Content</CardTitle>
                        <CardDescription>Update the full About Page (Hero, Story, Values, and Team).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Hero Section */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Hero Banner</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Title</Label><Input value={aboutPageData.hero?.title || ''} onChange={(e) => setAboutPageData(p => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Subtitle</Label><Input value={aboutPageData.hero?.subtitle || ''} onChange={(e) => setAboutPageData(p => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))} /></div>
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Background Image</Label>
                                <Input type="file" accept="image/*" onChange={(e) => setAboutPageHeroFile(e.target.files?.[0] || null)} />
                                <ImagePreview file={aboutPageHeroFile} currentUrl={aboutPageData.hero?.image} />
                            </div>
                        </div>

                        {/* Our Story */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Our Story</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Title Part 1</Label><Input value={aboutPageData.story.titlePart1} onChange={(e) => setAboutPageData(p => ({ ...p, story: { ...p.story, titlePart1: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Title Part 2 (Highlight)</Label><Input value={aboutPageData.story.titlePart2} onChange={(e) => setAboutPageData(p => ({ ...p, story: { ...p.story, titlePart2: e.target.value } }))} /></div>
                            </div>
                            <div className="space-y-2"><Label>Content (Paragraphs separated by line breaks)</Label><Textarea rows={6} value={aboutPageData.story.content} onChange={(e) => setAboutPageData(p => ({ ...p, story: { ...p.story, content: e.target.value } }))} /></div>
                            <div className="space-y-2">
                                <Label>Story Image</Label>
                                <Input type="file" accept="image/*" onChange={(e) => setAboutPageStoryFile(e.target.files?.[0] || null)} />
                                <ImagePreview file={aboutPageStoryFile} currentUrl={aboutPageData.story.image} />
                            </div>
                        </div>

                        {/* Our Values */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Our Values</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Badge</Label><Input value={aboutPageData.values.badge} onChange={(e) => setAboutPageData(p => ({ ...p, values: { ...p.values, badge: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Title</Label><Input value={aboutPageData.values.title} onChange={(e) => setAboutPageData(p => ({ ...p, values: { ...p.values, title: e.target.value } }))} /></div>
                            </div>
                            <div className="space-y-4 mt-4">
                                {aboutPageData.values.items.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-[1fr_2fr] gap-4">
                                        <div className="space-y-2"><Label>Value {idx + 1} Title</Label><Input value={item.title} onChange={(e) => setAboutPageData(p => { const n = [...p.values.items]; n[idx].title = e.target.value; return { ...p, values: { ...p.values, items: n } } })} /></div>
                                        <div className="space-y-2"><Label>Description</Label><Textarea value={item.description} onChange={(e) => setAboutPageData(p => { const n = [...p.values.items]; n[idx].description = e.target.value; return { ...p, values: { ...p.values, items: n } } })} /></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Team Section</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Badge</Label><Input value={aboutPageData.team.badge} onChange={(e) => setAboutPageData(p => ({ ...p, team: { ...p.team, badge: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Title</Label><Input value={aboutPageData.team.title} onChange={(e) => setAboutPageData(p => ({ ...p, team: { ...p.team, title: e.target.value } }))} /></div>
                            </div>
                            <div className="space-y-2"><Label>Content (Paragraphs separated by line breaks)</Label><Textarea rows={6} value={aboutPageData.team.content} onChange={(e) => setAboutPageData(p => ({ ...p, team: { ...p.team, content: e.target.value } }))} /></div>
                            <div className="space-y-2">
                                <Label>Team Image</Label>
                                <Input type="file" accept="image/*" onChange={(e) => setAboutPageTeamFile(e.target.files?.[0] || null)} />
                                <ImagePreview file={aboutPageTeamFile} currentUrl={aboutPageData.team.image} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter><Button type="submit" disabled={loading}>Save About Page Changes</Button></CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default function AboutPageAdmin() {
    return (
        <Suspense fallback={<div>Loading about page settings...</div>}>
            <AboutPageSettings />
        </Suspense>
    )
}
