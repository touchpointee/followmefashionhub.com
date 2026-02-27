"use client"

import React, { useState } from 'react'
import { ImageIcon } from "lucide-react"

export default function FallbackImage({ src, alt }: { src: string, alt: string }) {
    const [error, setError] = useState(false)

    if (error || !src || src.trim() === '' || src === 'undefined' || src === 'null') {
        return <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
    }

    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full"
            onError={() => setError(true)}
        />
    )
}
