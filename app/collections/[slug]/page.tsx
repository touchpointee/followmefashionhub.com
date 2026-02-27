"use client"

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCollections, getCollectionById, Collection } from '@/lib/collections-data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowLeft } from 'lucide-react'

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollectionById(slug)
      .then(data => {
        setCollection(data || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <main className="min-h-screen pt-32"><div className="text-center">Loading...</div></main>

  if (!collection) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <CollectionHero collection={collection} />

      {/* Editorial Description */}
      <CollectionDescription collection={collection} />

      {/* Lookbook Gallery */}
      <CollectionGallery collection={collection} />

      {/* Other Collections */}
      <OtherCollections currentId={collection.id} />

      <Footer />
    </main>
  )
}

function CollectionHero({ collection }: { collection: any }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  if (!collection) return null

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      <Image
        src={collection.heroImage || "/placeholder.svg"}
        alt={collection.name}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          ref={ref}
          className={`${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <span className="text-xs font-medium tracking-widest text-primary-foreground/70 uppercase">
            {collection.season} {collection.year}
          </span>
          <h1 className="mt-4 text-4xl font-light tracking-wide text-primary-foreground md:text-6xl lg:text-7xl">
            {collection.name}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-primary-foreground/80">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/collections"
        className="absolute left-6 top-28 flex items-center gap-2 text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
      >
        <ArrowLeft size={16} />
        Back to Collections
      </Link>
    </section>
  )
}

function CollectionDescription({ collection }: { collection: any }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  if (!collection) return null

  const paragraphs = collection.longDescription.split('\n\n')

  return (
    <section className="bg-background py-24 md:py-32">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-6 lg:px-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      >
        <h2 className="text-2xl font-light tracking-wide text-foreground md:text-3xl">
          The Vision
        </h2>
        <div className="mt-10 space-y-6">
          {paragraphs.map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-sm font-light leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function CollectionGallery({ collection }: { collection: any }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  if (!collection) return null

  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-16 text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <h2 className="text-2xl font-light tracking-wide text-foreground md:text-3xl">
            Lookbook
          </h2>
        </div>

        {/* Mixed Layout Gallery */}
        <div className="grid gap-8">
          {/* First row - Full width */}
          <GalleryImage src={collection.gallery[0]} alt={`${collection.name} lookbook 1`} index={0} fullWidth />

          {/* Second row - Two columns */}
          <div className="grid gap-8 md:grid-cols-2">
            <GalleryImage src={collection.gallery[1]} alt={`${collection.name} lookbook 2`} index={1} />
            <GalleryImage src={collection.gallery[2]} alt={`${collection.name} lookbook 3`} index={2} />
          </div>

          {/* Third row - Full width */}
          <GalleryImage src={collection.gallery[3]} alt={`${collection.name} lookbook 4`} index={3} fullWidth />

          {/* Fourth row - Two columns */}
          <div className="grid gap-8 md:grid-cols-2">
            <GalleryImage src={collection.gallery[4]} alt={`${collection.name} lookbook 5`} index={4} />
            <GalleryImage src={collection.gallery[5]} alt={`${collection.name} lookbook 6`} index={5} />
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryImage({
  src,
  alt,
  index,
  fullWidth = false,
}: {
  src: string
  alt: string
  index: number
  fullWidth?: boolean
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`image-hover-zoom relative overflow-hidden ${fullWidth ? 'aspect-[21/9]' : 'aspect-[4/5]'
        } ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        sizes={fullWidth ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
      />
    </div>
  )
}

function OtherCollections({ currentId }: { currentId: string }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [otherCollections, setOtherCollections] = useState<any[]>([])

  useEffect(() => {
    getCollections().then(data => {
      setOtherCollections(data.filter((c) => c.id !== currentId).slice(0, 2))
    })
  }, [currentId])

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-16 text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <h2 className="text-2xl font-light tracking-wide text-foreground md:text-3xl">
            Explore More
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {otherCollections.map((collection, index) => (
            <OtherCollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OtherCollectionCard({
  collection,
  index,
}: {
  collection: any
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Link href={`/collections/${collection.id}`}>
        <div className="image-hover-zoom relative aspect-[4/3] overflow-hidden">
          <Image
            src={collection.image || "/placeholder.svg"}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/20" />
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-medium tracking-wide text-foreground transition-colors duration-300 group-hover:text-muted-foreground">
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
