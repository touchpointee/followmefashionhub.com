"use client"

import Image from 'next/image'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { Instagram } from 'lucide-react'

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Gallery image 1' },
  { src: '/images/gallery-2.jpg', alt: 'Gallery image 2' },
  { src: '/images/gallery-3.jpg', alt: 'Gallery image 3' },
  { src: '/images/gallery-4.jpg', alt: 'Gallery image 4' },
  { src: '/images/lookbook-1.jpg', alt: 'Gallery image 5' },
  { src: '/images/lookbook-2.jpg', alt: 'Gallery image 6' },
]

export function ImageGallery() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-12 text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            @followmefashionhub
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-5xl">
            Follow Our Journey
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {galleryImages.map((image, index) => (
            <GalleryImage key={image.src} image={image} index={index} />
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-foreground px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            <Instagram size={16} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

function GalleryImage({
  image,
  index,
}: {
  image: { src: string; alt: string }
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`group ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="image-hover-zoom relative block aspect-square overflow-hidden"
      >
        <Image
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/60 group-hover:opacity-100">
          <Instagram size={32} className="text-primary-foreground" />
        </div>
      </a>
    </div>
  )
}
