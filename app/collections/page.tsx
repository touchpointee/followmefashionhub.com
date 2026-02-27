"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { collections } from '@/lib/collections-data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function CollectionsPage() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [heroData, setHeroData] = useState({ title: 'Collections', subtitle: 'Explore our carefully curated collections, each telling a unique story through fabric, form, and artistic vision.', image: '' })

  useEffect(() => {
    fetch('/api/content/pageHeroes')
      .then(res => res.json())
      .then(data => {
        if (data && data.collectionsHero) {
          setHeroData({
            title: data.collectionsHero.title || 'Collections',
            subtitle: data.collectionsHero.subtitle || 'Explore our carefully curated collections, each telling a unique story through fabric, form, and artistic vision.',
            image: data.collectionsHero.image || ''
          })
        }
      })
      .catch(console.error)
  }, [])

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden">
        {heroData.image && (
          <Image
            src={heroData.image}
            alt="Collections Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
          <div
            ref={headerRef}
            className={`text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
          >
            <h1 className="text-4xl font-light tracking-wide text-primary-foreground md:text-6xl">
              {heroData.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-relaxed text-primary-foreground/70">
              {heroData.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="bg-background py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 md:gap-24">
            {collections.map((collection, index) => (
              <CollectionRow key={collection.id} collection={collection} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CollectionRow({
  collection,
  index,
}: {
  collection: (typeof collections)[0]
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${isVisible ? 'animate-fade-up' : 'opacity-0'
        }`}
    >
      {/* Image */}
      <Link
        href={`/collections/${collection.id}`}
        className={`image-hover-zoom group relative aspect-[4/5] overflow-hidden ${isEven ? 'md:order-1' : 'md:order-2'
          }`}
      >
        <Image
          src={collection.image || "/placeholder.svg"}
          alt={collection.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/20" />
      </Link>

      {/* Content */}
      <div className={`${isEven ? 'md:order-2' : 'md:order-1'}`}>
        <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {collection.season} {collection.year}
        </span>
        <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-4xl">
          {collection.name}
        </h2>
        <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground">
          {collection.description}
        </p>
        <Link
          href={`/collections/${collection.id}`}
          className="mt-8 inline-block border border-foreground px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
        >
          View Collection
        </Link>
      </div>
    </div>
  )
}
