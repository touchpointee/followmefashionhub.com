'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

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

function ContactPageSettings() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // CONTACT PAGE CONTENT STATE
    const [contactPageData, setContactPageData] = useState({
        info: {
            address: '123 Fashion Avenue\nNew York, NY 10001\nUnited States',
            email1: 'hello@followmefashionhub.com',
            email2: 'press@followmefashionhub.com',
            phone: '+1 (555) 123-4567',
            hoursMonFri: '9:00 AM - 6:00 PM',
            hoursSat: '10:00 AM - 4:00 PM',
            hoursSun: 'Closed',
        }
    })

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch('/api/content/contactPage')
                if (res.ok) {
                    const d = await res.json();
                    if (Object.keys(d).length > 0) {
                        setContactPageData(p => ({ ...p, ...d }))
                    }
                }
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

    const handleContactPageSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        wrapSubmit(async () => {
            const payload = { ...contactPageData }
            await saveSection('contactPage', payload)
        }, 'Contact Page settings updated successfully!')
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact Page Info</h1>
                <p className="text-muted-foreground">Manage the public contact information displayed on your Contact page.</p>
            </div>

            {message && <p className="text-emerald-600 font-medium">{message}</p>}

            <Card>
                <form onSubmit={handleContactPageSubmit}>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>Update your address, emails, phone numbers, and business hours. Note: Form submissions will appear in the Messages section.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Get in Touch Info */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Location & Contact Details</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Visit Us (Address text with line breaks supported)</Label>
                                    <Textarea rows={3} value={contactPageData.info.address} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, address: e.target.value } }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Primary Email Address</Label><Input value={contactPageData.info.email1} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, email1: e.target.value } }))} /></div>
                                    <div className="space-y-2"><Label>Secondary Email (e.g Press Email)</Label><Input value={contactPageData.info.email2} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, email2: e.target.value } }))} /></div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input value={contactPageData.info.phone} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, phone: e.target.value } }))} />
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                            <h3 className="font-medium text-lg">Business Hours</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2"><Label>Monday - Friday</Label><Input value={contactPageData.info.hoursMonFri} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, hoursMonFri: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Saturday</Label><Input value={contactPageData.info.hoursSat} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, hoursSat: e.target.value } }))} /></div>
                                <div className="space-y-2"><Label>Sunday</Label><Input value={contactPageData.info.hoursSun} onChange={(e) => setContactPageData(p => ({ ...p, info: { ...p.info, hoursSun: e.target.value } }))} /></div>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter><Button type="submit" disabled={loading}>Save Contact Settings</Button></CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default function ContactPageAdmin() {
    return (
        <Suspense fallback={<div>Loading contact page settings...</div>}>
            <ContactPageSettings />
        </Suspense>
    )
}
