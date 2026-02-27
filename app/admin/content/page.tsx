'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'

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

function ContentManagement() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || 'hero'

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // 0. PAGE HEROES STATE
    const [pageHeroesData, setPageHeroesData] = useState({
        aboutHero: { title: 'About Us', subtitle: 'Our Story', image: '' },
        contactHero: { title: 'Contact Us', subtitle: 'Get in touch', image: '' },
        collectionsHero: { title: 'Collections', subtitle: 'Explore our curated collections', image: '' },
        journalHero: { title: 'Journal', subtitle: 'Stories, insights, and inspirations', image: '' },
    })
    const [pageHeroesFiles, setPageHeroesFiles] = useState<{ [key: string]: File | null }>({
        aboutHero: null,
        contactHero: null,
        collectionsHero: null,
        journalHero: null,
    })

    // 1. HERO STATE
    const [heroData, setHeroData] = useState({
        titleLine1: 'Modern Men\'s',
        titleLine2: 'Fashion',
        subtitle: 'Explore Our New Store Opening in Kaniyapuram. Where style meets substance.',
        ctaAction1: 'Shop Collection',
        ctaAction2: 'Visit Store',
        backgroundImage: '',
    })
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

    // 2. ABOUT STATE
    const [aboutData, setAboutData] = useState({
        badge: 'About Follow Me',
        titleLine1: 'Discover Your Unique',
        titleLine2: 'Style',
        paragraph1: 'At Follow Me, we offer the latest in men\'s fashion, with two stores in Trivandrum and a new location opening soon in Kaniyapuram.',
        paragraph2: 'Our Trivandrum-based store specializes in men\'s fashion, providing stylish and trendy options for every occasion. Visit us to elevate your wardrobe.',
        testimonial: 'The quality is outstanding, and the staff is incredibly helpful. Highly recommend shopping here! - Shareef',
        ctaLabel: 'Visit Our Stores',
        sideImage: '',
    })
    const [aboutImageFile, setAboutImageFile] = useState<File | null>(null)

    // 3. FEATURED COLLECTIONS STATE
    const [featuredData, setFeaturedData] = useState({
        headerBadge: 'Featured',
        headerTitle: 'Our Collections',
        headerDesc: 'Explore our carefully curated collections, each telling a unique story through fabric, form, and artistic vision.',
        collections: [
            { id: 'mens-trends', name: "Men's Trends", description: '', image: '' },
            { id: 'accessories', name: 'Accessories', description: '', image: '' },
            { id: 'footwear', name: 'Footwear', description: '', image: '' },
        ]
    })
    const [featuredFiles, setFeaturedFiles] = useState<(File | null)[]>([null, null, null])

    // 4. VISUAL BREAK STATE
    const [breakData, setBreakData] = useState({
        quote: '"Fashion is not something that exists in dresses only. Fashion is in the sky, in the street. Fashion has to do with ideas, the way we live, what is happening."',
        author: '— Coco Chanel',
        backgroundImage: '',
    })
    const [breakImageFile, setBreakImageFile] = useState<File | null>(null)

    // 5. LOOKBOOK STATE
    const [lookbookData, setLookbookData] = useState({
        headerBadge: 'Editorial',
        headerTitle: 'Lookbook',
        images: [
            { caption: 'Spring Collection 2026', image: '' },
            { caption: 'Urban Edge Series', image: '' },
            { caption: 'Timeless Essentials', image: '' },
        ]
    })
    const [lookbookFiles, setLookbookFiles] = useState<(File | null)[]>([null, null, null])

    // 6. JOURNAL STATE
    const [journalData, setJournalData] = useState({
        headerBadge: 'From the Journal',
        headerTitle: 'Latest Stories',
        articles: [
            { slug: 'a', title: 'The Art of Sustainable Fashion', excerpt: '', image: '', date: 'January 15, 2026', category: 'Sustainability' },
            { slug: 'b', title: 'Behind the Scenes: Spring Collection', excerpt: '', image: '', date: 'January 10, 2026', category: 'Collections' },
            { slug: 'c', title: 'Timeless Pieces Every Wardrobe Needs', excerpt: '', image: '', date: 'January 5, 2026', category: 'Style Guide' },
        ]
    })
    const [journalFiles, setJournalFiles] = useState<(File | null)[]>([null, null, null])

    // 7. GALLERY STATE
    const [galleryData, setGalleryData] = useState({
        headerBadge: '@followmefashionhub',
        headerTitle: 'Follow Our Journey',
        igLink: 'https://instagram.com',
        images: ['', '', '', '', '', '']
    })
    const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null, null, null])

    useEffect(() => {
        async function loadData() {
            try {
                const [hRes, aRes, fRes, bRes, lRes, jRes, gRes, phRes] = await Promise.all([
                    fetch('/api/content/hero'), fetch('/api/content/about'),
                    fetch('/api/content/featured'), fetch('/api/content/visualBreak'),
                    fetch('/api/content/lookbook'), fetch('/api/content/journal'), fetch('/api/content/gallery'),
                    fetch('/api/content/pageHeroes')
                ])

                if (hRes.ok) { const d = await hRes.json(); if (Object.keys(d).length > 0) setHeroData(p => ({ ...p, ...d })) }
                if (aRes.ok) { const d = await aRes.json(); if (Object.keys(d).length > 0) setAboutData(p => ({ ...p, ...d })) }
                if (fRes.ok) { const d = await fRes.json(); if (Object.keys(d).length > 0) setFeaturedData(p => ({ ...p, ...d })) }
                if (bRes.ok) { const d = await bRes.json(); if (Object.keys(d).length > 0) setBreakData(p => ({ ...p, ...d })) }
                if (lRes.ok) { const d = await lRes.json(); if (Object.keys(d).length > 0) setLookbookData(p => ({ ...p, ...d })) }
                if (jRes.ok) { const d = await jRes.json(); if (Object.keys(d).length > 0) setJournalData(p => ({ ...p, ...d })) }
                if (gRes.ok) { const d = await gRes.json(); if (Object.keys(d).length > 0) setGalleryData(p => ({ ...p, ...d })) }
                if (phRes.ok) { const d = await phRes.json(); if (Object.keys(d).length > 0) setPageHeroesData(p => ({ ...p, ...d })) }
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

    const handlePageHeroesSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...pageHeroesData }
            const keys = ['aboutHero', 'contactHero', 'collectionsHero', 'journalHero'] as const
            for (const key of keys) {
                if (pageHeroesFiles[key]) {
                    payload[key].image = await uploadFile(pageHeroesFiles[key]!)
                }
            }
            await saveSection('pageHeroes', payload)
        }, 'Page Heroes updated successfully!')
    }

    const handleHeroSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...heroData }
            if (heroImageFile) payload.backgroundImage = await uploadFile(heroImageFile)
            await saveSection('hero', payload)
        }, 'Hero section updated successfully!')
    }

    const handleAboutSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...aboutData }
            if (aboutImageFile) payload.sideImage = await uploadFile(aboutImageFile)
            await saveSection('about', payload)
        }, 'About section updated successfully!')
    }

    const handleFeaturedSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...featuredData }
            for (let i = 0; i < featuredFiles.length; i++) {
                if (featuredFiles[i]) payload.collections[i].image = await uploadFile(featuredFiles[i]!)
            }
            await saveSection('featured', payload)
        }, 'Featured Collections updated successfully!')
    }

    const handleBreakSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...breakData }
            if (breakImageFile) payload.backgroundImage = await uploadFile(breakImageFile)
            await saveSection('visualBreak', payload)
        }, 'Visual Break section updated successfully!')
    }

    const handleLookbookSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...lookbookData }
            for (let i = 0; i < lookbookFiles.length; i++) {
                if (lookbookFiles[i]) payload.images[i].image = await uploadFile(lookbookFiles[i]!)
            }
            await saveSection('lookbook', payload)
        }, 'Lookbook Slider updated successfully!')
    }

    const handleJournalSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...journalData }
            for (let i = 0; i < journalFiles.length; i++) {
                if (journalFiles[i]) payload.articles[i].image = await uploadFile(journalFiles[i]!)
            }
            await saveSection('journal', payload)
        }, 'Journal section updated successfully!')
    }

    const handleGallerySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...galleryData }
            for (let i = 0; i < galleryFiles.length; i++) {
                if (galleryFiles[i]) payload.images[i] = await uploadFile(galleryFiles[i]!)
            }
            await saveSection('gallery', payload)
        }, 'Image Gallery updated successfully!')
    }


    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Site Content</h1>
                <p className="text-muted-foreground">Manage dynamic content sections for the website.</p>
            </div>

            {message && <p className="text-emerald-600 font-medium">{message}</p>}

            <Tabs value={currentTab} onValueChange={(val) => router.push(`/admin/content?tab=${val}`)} className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto gap-2">
                    <TabsTrigger value="hero">Home Banner</TabsTrigger>
                    <TabsTrigger value="pageHeroes">Page Heroes</TabsTrigger>
                    <TabsTrigger value="about">About Section</TabsTrigger>
                    <TabsTrigger value="featured">Featured Collections</TabsTrigger>
                    <TabsTrigger value="break">Visual Break</TabsTrigger>
                    <TabsTrigger value="lookbook">Lookbook</TabsTrigger>
                    <TabsTrigger value="journal">Journal</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="hero">
                    <Card>
                        <form onSubmit={handleHeroSubmit}>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>Update the main banner text and background image.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title Line 1</Label>
                                        <Input value={heroData.titleLine1} onChange={(e) => setHeroData({ ...heroData, titleLine1: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Title Line 2</Label>
                                        <Input value={heroData.titleLine2} onChange={(e) => setHeroData({ ...heroData, titleLine2: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Textarea value={heroData.subtitle} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>CTA Primary Button</Label>
                                        <Input value={heroData.ctaAction1} onChange={(e) => setHeroData({ ...heroData, ctaAction1: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CTA Secondary Button</Label>
                                        <Input value={heroData.ctaAction2} onChange={(e) => setHeroData({ ...heroData, ctaAction2: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Image</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
                                    <ImagePreview file={heroImageFile} currentUrl={heroData.backgroundImage} />
                                </div>
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Hero Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="pageHeroes">
                    <Card>
                        <form onSubmit={handlePageHeroesSubmit}>
                            <CardHeader>
                                <CardTitle>Global Page Heroes</CardTitle>
                                <CardDescription>Manage the main hero banners for the inner pages (About, Contact, Collections, and Journal).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {(Object.keys(pageHeroesData) as Array<keyof typeof pageHeroesData>).map((key) => {
                                    const pageName = key.replace('Hero', '')
                                    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1)
                                    return (
                                        <div key={key} className="space-y-4 border p-4 rounded-md bg-muted/20">
                                            <h3 className="text-lg font-medium">{formattedPageName} Page Hero</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={pageHeroesData[key].title}
                                                        onChange={(e) => setPageHeroesData((prev) => ({ ...prev, [key]: { ...prev[key], title: e.target.value } }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Subtitle (Top Badge)</Label>
                                                    <Input
                                                        value={pageHeroesData[key].subtitle}
                                                        onChange={(e) => setPageHeroesData((prev) => ({ ...prev, [key]: { ...prev[key], subtitle: e.target.value } }))}
                                                    />
                                                </div>
                                                <div className="space-y-2 col-span-2">
                                                    <Label>Background Image</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setPageHeroesFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] || null }))}
                                                    />
                                                    <ImagePreview file={pageHeroesFiles[key]} currentUrl={pageHeroesData[key].image} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Page Heroes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <form onSubmit={handleAboutSubmit}>
                            <CardHeader>
                                <CardTitle>About Section</CardTitle>
                                <CardDescription>Update the introductory copy and image for the About Us block.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Omitted redundant copy/paste block structure for brevity in testing, using the same pattern below */}
                                <div className="space-y-2"><Label>Section Badge</Label><Input value={aboutData.badge} onChange={(e) => setAboutData({ ...aboutData, badge: e.target.value })} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Title Line 1</Label><Input value={aboutData.titleLine1} onChange={(e) => setAboutData({ ...aboutData, titleLine1: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Title Highlight</Label><Input value={aboutData.titleLine2} onChange={(e) => setAboutData({ ...aboutData, titleLine2: e.target.value })} /></div>
                                </div>
                                <div className="space-y-2"><Label>Paragraph 1</Label><Textarea value={aboutData.paragraph1} onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })} /></div>
                                <div className="space-y-2">
                                    <Label>Side Image</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)} />
                                    <ImagePreview file={aboutImageFile} currentUrl={aboutData.sideImage} />
                                </div>
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save About Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="featured">
                    <Card>
                        <form onSubmit={handleFeaturedSubmit}>
                            <CardHeader><CardTitle>Featured Collections</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                    <div className="space-y-2"><Label>Header Badge</Label><Input value={featuredData.headerBadge} onChange={(e) => setFeaturedData({ ...featuredData, headerBadge: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Header Title</Label><Input value={featuredData.headerTitle} onChange={(e) => setFeaturedData({ ...featuredData, headerTitle: e.target.value })} /></div>
                                    <div className="space-y-2 col-span-3"><Label>Header Description</Label><Textarea value={featuredData.headerDesc} onChange={(e) => setFeaturedData({ ...featuredData, headerDesc: e.target.value })} /></div>
                                </div>

                                {featuredData.collections?.map((col, idx) => (
                                    <div key={idx} className="space-y-4 border p-4 rounded-md bg-muted/20">
                                        <h3 className="font-medium">Collection {idx + 1}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={col.name} onChange={(e) => setFeaturedData(prev => { const n = [...prev.collections]; n[idx].name = e.target.value; return { ...prev, collections: n } })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Image</Label>
                                                <Input type="file" accept="image/*" onChange={(e) => setFeaturedFiles(prev => { const n = [...prev]; n[idx] = e.target.files?.[0] || null; return n })} />
                                                <ImagePreview file={featuredFiles[idx]} currentUrl={col.image} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea value={col.description} onChange={(e) => setFeaturedData(prev => { const n = [...prev.collections]; n[idx].description = e.target.value; return { ...prev, collections: n } })} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Featured Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="break">
                    <Card>
                        <form onSubmit={handleBreakSubmit}>
                            <CardHeader><CardTitle>Visual Break Parallax</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label>Quote text</Label><Textarea value={breakData.quote} onChange={(e) => setBreakData({ ...breakData, quote: e.target.value })} /></div>
                                <div className="space-y-2"><Label>Author</Label><Input value={breakData.author} onChange={(e) => setBreakData({ ...breakData, author: e.target.value })} /></div>
                                <div className="space-y-2">
                                    <Label>Parallax Background Image</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => setBreakImageFile(e.target.files?.[0] || null)} />
                                    <ImagePreview file={breakImageFile} currentUrl={breakData.backgroundImage} />
                                </div>
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Break Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="lookbook">
                    <Card>
                        <form onSubmit={handleLookbookSubmit}>
                            <CardHeader><CardTitle>Lookbook Slider</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                    <div className="space-y-2"><Label>Header Badge</Label><Input value={lookbookData.headerBadge} onChange={(e) => setLookbookData({ ...lookbookData, headerBadge: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Header Title</Label><Input value={lookbookData.headerTitle} onChange={(e) => setLookbookData({ ...lookbookData, headerTitle: e.target.value })} /></div>
                                </div>

                                {lookbookData.images?.map((img, idx) => (
                                    <div key={idx} className="grid grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="space-y-2">
                                            <Label>Caption {idx + 1}</Label>
                                            <Input value={img.caption} onChange={(e) => setLookbookData(prev => { const n = [...prev.images]; n[idx].caption = e.target.value; return { ...prev, images: n } })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Image {idx + 1}</Label>
                                            <Input type="file" accept="image/*" onChange={(e) => setLookbookFiles(prev => { const n = [...prev]; n[idx] = e.target.files?.[0] || null; return n })} />
                                            <ImagePreview file={lookbookFiles[idx]} currentUrl={img.image} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Lookbook Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="journal">
                    <Card>
                        <form onSubmit={handleJournalSubmit}>
                            <CardHeader><CardTitle>Journal Preview</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                    <div className="space-y-2"><Label>Header Badge</Label><Input value={journalData.headerBadge} onChange={(e) => setJournalData({ ...journalData, headerBadge: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Header Title</Label><Input value={journalData.headerTitle} onChange={(e) => setJournalData({ ...journalData, headerTitle: e.target.value })} /></div>
                                </div>

                                {journalData.articles?.map((art, idx) => (
                                    <div key={idx} className="space-y-4 border p-4 rounded-md bg-muted/20">
                                        <h3 className="font-medium">Article {idx + 1}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Title</Label>
                                                <Input value={art.title} onChange={(e) => setJournalData(prev => { const n = [...prev.articles]; n[idx].title = e.target.value; return { ...prev, articles: n } })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Image</Label>
                                                <Input type="file" accept="image/*" onChange={(e) => setJournalFiles(prev => { const n = [...prev]; n[idx] = e.target.files?.[0] || null; return n })} />
                                                <ImagePreview file={journalFiles[idx]} currentUrl={art.image} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <Input value={art.category} onChange={(e) => setJournalData(prev => { const n = [...prev.articles]; n[idx].category = e.target.value; return { ...prev, articles: n } })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Input value={art.date} onChange={(e) => setJournalData(prev => { const n = [...prev.articles]; n[idx].date = e.target.value; return { ...prev, articles: n } })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Excerpt Summary</Label>
                                            <Textarea value={art.excerpt} onChange={(e) => setJournalData(prev => { const n = [...prev.articles]; n[idx].excerpt = e.target.value; return { ...prev, articles: n } })} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Journal Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="gallery">
                    <Card>
                        <form onSubmit={handleGallerySubmit}>
                            <CardHeader><CardTitle>Instagram Gallery</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                    <div className="space-y-2"><Label>Header Badge</Label><Input value={galleryData.headerBadge} onChange={(e) => setGalleryData({ ...galleryData, headerBadge: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Header Title</Label><Input value={galleryData.headerTitle} onChange={(e) => setGalleryData({ ...galleryData, headerTitle: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Instagram CTA Link</Label><Input value={galleryData.igLink} onChange={(e) => setGalleryData({ ...galleryData, igLink: e.target.value })} /></div>
                                </div>

                                <h3 className="font-medium">Gallery Images (6 tiles)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryData.images?.map((img, idx) => (
                                        <div key={idx} className="space-y-2 border p-2 rounded-md bg-muted/20">
                                            <Label>Image {idx + 1}</Label>
                                            <Input type="file" accept="image/*" onChange={(e) => setGalleryFiles(prev => { const n = [...prev]; n[idx] = e.target.files?.[0] || null; return n })} />
                                            <ImagePreview file={galleryFiles[idx]} currentUrl={img} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter><Button type="submit" disabled={loading}>Save Gallery Changes</Button></CardFooter>
                        </form>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}

export default function ContentManagementPage() {
    return (
        <Suspense fallback={<div>Loading content management...</div>}>
            <ContentManagement />
        </Suspense>
    )
}
