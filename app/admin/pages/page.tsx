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

function PagesSettings() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || 'pageHeroes'

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // PAGE HEROES STATE
    const [pageHeroesData, setPageHeroesData] = useState({
        contactHero: { title: 'Contact Us', subtitle: 'Get in touch', image: '' },
        collectionsHero: { title: 'Collections', subtitle: 'Explore our curated collections', image: '' },
        journalHero: { title: 'Journal', subtitle: 'Stories, insights, and inspirations', image: '' },
    })
    const [pageHeroesFiles, setPageHeroesFiles] = useState<{ [key: string]: File | null }>({
        contactHero: null,
        collectionsHero: null,
        journalHero: null,
    })

    // LEGAL PAGES STATE
    const [legalData, setLegalData] = useState({
        privacy: '',
        terms: '',
    })

    useEffect(() => {
        async function loadData() {
            try {
                const [phRes, lpRes] = await Promise.all([
                    fetch('/api/content/pageHeroes'),
                    fetch('/api/content/legalPages')
                ])
                if (phRes.ok) { const d = await phRes.json(); if (Object.keys(d).length > 0) setPageHeroesData(p => ({ ...p, ...d })) }
                if (lpRes.ok) { const d = await lpRes.json(); if (Object.keys(d).length > 0) setLegalData(p => ({ ...p, ...d })) }
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
            const keys = ['contactHero', 'collectionsHero', 'journalHero'] as const
            for (const key of keys) {
                if (pageHeroesFiles[key]) {
                    payload[key].image = await uploadFile(pageHeroesFiles[key]!)
                }
            }
            // Fetch existing to preserve About Hero which is now managed separately
            const existingRes = await fetch('/api/content/pageHeroes')
            const existing = await existingRes.json()

            await saveSection('pageHeroes', { ...existing, ...payload })
        }, 'Page Heroes updated successfully!')
    }

    const handleLegalSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            await saveSection('legalPages', legalData)
        }, 'Legal Pages updated successfully!')
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pages Settings</h1>
                <p className="text-muted-foreground">Manage dynamic content for individual static pages on the website.</p>
            </div>

            {message && <p className="text-emerald-600 font-medium">{message}</p>}

            <Tabs value={currentTab} onValueChange={(val) => router.push(`/admin/pages?tab=${val}`)} className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto gap-2">
                    <TabsTrigger value="pageHeroes">Page Heroes</TabsTrigger>
                    <TabsTrigger value="legal">Legal Pages</TabsTrigger>
                </TabsList>

                <TabsContent value="pageHeroes">
                    <Card>
                        <form onSubmit={handlePageHeroesSubmit}>
                            <CardHeader>
                                <CardTitle>Global Page Heroes</CardTitle>
                                <CardDescription>Manage the main hero banners for the inner pages (Contact, Collections, and Journal).</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {(Object.keys(pageHeroesData) as Array<keyof typeof pageHeroesData>).map((key) => {
                                    if (key === 'aboutHero' as any) return null; // safety check
                                    const pageName = key.replace('Hero', '')
                                    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1)
                                    return (
                                        <div key={key} className="space-y-4 border p-4 rounded-md bg-muted/20">
                                            <h3 className="text-lg font-medium">{formattedPageName} Page Hero</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={pageHeroesData[key as keyof typeof pageHeroesData]?.title}
                                                        onChange={(e) => setPageHeroesData((prev) => ({ ...prev, [key]: { ...prev[key as keyof typeof pageHeroesData], title: e.target.value } }))}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Subtitle (Top Badge)</Label>
                                                    <Input
                                                        value={pageHeroesData[key as keyof typeof pageHeroesData]?.subtitle}
                                                        onChange={(e) => setPageHeroesData((prev) => ({ ...prev, [key]: { ...prev[key as keyof typeof pageHeroesData], subtitle: e.target.value } }))}
                                                    />
                                                </div>
                                                <div className="space-y-2 col-span-2">
                                                    <Label>Background Image</Label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setPageHeroesFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] || null }))}
                                                    />
                                                    <ImagePreview file={pageHeroesFiles[key]} currentUrl={pageHeroesData[key as keyof typeof pageHeroesData]?.image} />
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

                <TabsContent value="legal">
                    <Card>
                        <form onSubmit={handleLegalSubmit}>
                            <CardHeader>
                                <CardTitle>Legal Pages</CardTitle>
                                <CardDescription>Manage the content for the Privacy Policy and Terms of Service pages.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Privacy Policy</Label>
                                    <Textarea
                                        value={legalData.privacy}
                                        onChange={(e) => setLegalData({ ...legalData, privacy: e.target.value })}
                                        className="min-h-[200px]"
                                    />
                                    <p className="text-xs text-muted-foreground">This content is displayed on the /privacy page.</p>
                                </div>
                                <div className="space-y-2 pt-4 border-t">
                                    <Label>Terms of Service</Label>
                                    <Textarea
                                        value={legalData.terms}
                                        onChange={(e) => setLegalData({ ...legalData, terms: e.target.value })}
                                        className="min-h-[200px]"
                                    />
                                    <p className="text-xs text-muted-foreground">This content is displayed on the /terms page.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading}>Save Legal Pages</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default function PagesSettingsPage() {
    return (
        <Suspense fallback={<div>Loading pages settings...</div>}>
            <PagesSettings />
        </Suspense>
    )
}
