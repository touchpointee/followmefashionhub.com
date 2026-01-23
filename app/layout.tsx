import React from "react"
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Follow Me Fashion Hub | Luxury Fashion Portfolio',
  description: 'Discover the latest collections from Follow Me Fashion Hub. A luxury fashion brand showcasing editorial visuals, lookbooks, and contemporary style.',
  keywords: ['fashion', 'luxury', 'portfolio', 'collections', 'lookbook', 'editorial'],
  generator: 'v0.app'
}

export const viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
