'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, Trash2 } from 'lucide-react'

export default function MessagesAdmin() {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/messages')
            if (!res.ok) throw new Error('Failed to fetch messages')
            const data = await res.json()
            setMessages(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: !currentStatus })
            })
            if (!res.ok) throw new Error('Failed to update status')
            fetchMessages()
        } catch (err: any) {
            alert(err.message)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error('Failed to delete message')
            fetchMessages()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Inbox Messages</h1>
                <p className="text-muted-foreground">View and manage messages sent from the Contact Us page.</p>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <p>Loading messages...</p>
            ) : messages.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <Mail className="h-12 w-12 mb-4 opacity-20" />
                        <p>No messages found. When someone fills out the contact form, it will appear here.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg) => (
                        <Card key={msg._id} className={msg.read ? 'bg-muted/30' : 'bg-background border-l-4 border-l-primary'}>
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg">
                                        {msg.subject || 'No Subject'} {!msg.read && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-2">New</span>}
                                    </CardTitle>
                                    <CardDescription className="text-sm mt-1">
                                        <span className="font-medium text-foreground">{msg.name}</span> ({msg.email})
                                    </CardDescription>
                                </div>
                                <div className="text-xs text-muted-foreground text-right w-fit shrink-0 whitespace-nowrap">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => markAsRead(msg._id, msg.read)}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteMessage(msg._id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
