"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface FeaturedData {
  headerBadge?: string
  headerTitle?: string
  headerDesc?: string
  collections?: {
    id: string
    name: string
    description: string
    image: string
  }[]
}

const defaultCollections = [
  {
    id: 'mens-trends',
    name: "Men's Trends",
    description: 'Contemporary styles for the modern man',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'The finishing touches defined by detail',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Steps towards timeless elegance',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
  },
]

export function FeaturedCollections({ data }: { data?: FeaturedData }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  const activeCollections = data?.collections?.length === 3 ? data.collections : defaultCollections

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-16 text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {data?.headerBadge || "Featured"}
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-5xl">
            {data?.headerTitle || "Our Collections"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed text-muted-foreground">
            {data?.headerDesc || "Explore our carefully curated collections, each telling a unique story through fabric, form, and artistic vision."}
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {activeCollections.map((collection, index) => (
            <CollectionCard key={index} collection={collection} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href="/collections"
            className="inline-block border-b border-foreground pb-1 text-sm font-light tracking-widest text-foreground uppercase transition-all duration-300 hover:border-muted-foreground hover:text-muted-foreground"
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  )
}

function CollectionCard({
  collection,
  index,
}: {
  collection: { id?: string, name: string, description: string, image: string }
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`group ${isVisible ? `animate-fade-up delay-${(index + 1) * 200}` : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Link href={collection.id ? `/collections/${collection.id}` : '#'}>
        <div className="image-hover-zoom relative aspect-[3/4] overflow-hidden">
          <Image
            src={collection.image || "/placeholder.svg"}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/20" />
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium tracking-wide text-foreground transition-colors duration-300 group-hover:text-muted-foreground">
            {collection.name}
          </h3>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            {collection.description}
          </p>
        </div>
      </Link>
    </div>
  )
}
