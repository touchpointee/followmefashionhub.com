'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [footerData, setFooterData] = useState<any>({})

  useEffect(() => {
    fetch('/api/content/footer')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) setFooterData(data)
      })
      .catch(console.error)
  }, [])

  // Set default fallbacks in case data isn't set yet
  const brandDescription = footerData.brandDescription || 'A luxury fashion brand dedicated to contemporary elegance and timeless design. We believe in the power of fashion to inspire confidence and self-expression.'
  const instagram = footerData?.socialLinks?.instagram !== undefined ? footerData.socialLinks.instagram : 'https://instagram.com'
  const facebook = footerData?.socialLinks?.facebook !== undefined ? footerData.socialLinks.facebook : 'https://facebook.com'
  const twitter = footerData?.socialLinks?.twitter !== undefined ? footerData.socialLinks.twitter : 'https://twitter.com'
  const copyrightText = footerData.copyrightText || 'Follow Me Fashion Hub. All rights reserved.'
  const privacyLink = footerData?.bottomLinks?.privacyLink || '/privacy'
  const termsLink = footerData?.bottomLinks?.termsLink || '/terms'

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="Follow Me Fashion Hub"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-primary-foreground/70">
              {brandDescription}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase">Explore</h4>
            <nav className="mt-6 flex flex-col gap-4">
              <Link
                href="/collections"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Collections
              </Link>
              <Link
                href="/journal"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Journal
              </Link>
              <Link
                href="/about"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase">Connect</h4>
            <div className="mt-6 flex flex-wrap gap-4">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-xs font-light text-primary-foreground/50 text-center md:text-left">
            © {currentYear} {copyrightText}
          </p>
          <div className="flex gap-6">
            <Link
              href={privacyLink}
              className="text-xs font-light text-primary-foreground/50 transition-colors duration-300 hover:text-primary-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href={termsLink}
              className="text-xs font-light text-primary-foreground/50 transition-colors duration-300 hover:text-primary-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
