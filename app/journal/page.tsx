"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { articles } from '@/lib/journal-data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function JournalPage() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [heroData, setHeroData] = useState({ title: 'Journal', subtitle: 'Stories, insights, and inspirations from the world of Follow Me Fashion Hub. Explore our thoughts on style, sustainability, and the art of dressing well.', image: '' })

  useEffect(() => {
    fetch('/api/content/pageHeroes')
      .then(res => res.json())
      .then(data => {
        if (data && data.journalHero) {
          setHeroData({
            title: data.journalHero.title || 'Journal',
            subtitle: data.journalHero.subtitle || 'Stories, insights, and inspirations from the world of Follow Me Fashion Hub. Explore our thoughts on style, sustainability, and the art of dressing well.',
            image: data.journalHero.image || ''
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
            alt="Journal Hero"
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

      {/* Featured Article */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeaturedArticle article={articles[0]} />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-secondary py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-light tracking-wide text-foreground">
              Latest Articles
            </h2>
          </div>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(1).map((article, index) => (
              <ArticleCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FeaturedArticle({ article }: { article: (typeof articles)[0] }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${isVisible ? 'animate-fade-up' : 'opacity-0'
        }`}
    >
      <Link
        href={`/journal/${article.slug}`}
        className="image-hover-zoom group relative aspect-[4/3] overflow-hidden"
      >
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-primary/0 transition-all duration-500 group-hover:bg-primary/20" />
      </Link>

      <div>
        <span className="inline-block bg-foreground px-3 py-1 text-xs font-medium tracking-wider text-background uppercase">
          Featured
        </span>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground/60">{article.date}</span>
        </div>
        <Link href={`/journal/${article.slug}`}>
          <h2 className="mt-4 text-2xl font-medium leading-tight tracking-wide text-foreground transition-colors duration-300 hover:text-muted-foreground md:text-3xl">
            {article.title}
          </h2>
        </Link>
        <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-4">
          <span className="text-xs font-light text-muted-foreground">By {article.author}</span>
          <span className="text-xs text-muted-foreground/60">{article.readTime}</span>
        </div>
        <Link
          href={`/journal/${article.slug}`}
          className="mt-8 inline-block border border-foreground px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
        >
          Read Article
        </Link>
      </div>
    </div>
  )
}

function ArticleCard({
  article,
  index,
}: {
  article: (typeof articles)[0]
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Link href={`/journal/${article.slug}`}>
        <div className="image-hover-zoom relative aspect-[4/3] overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground/60">{article.date}</span>
          </div>
          <h3 className="mt-3 text-lg font-medium leading-tight tracking-wide text-foreground transition-colors duration-300 group-hover:text-muted-foreground">
            {article.title}
          </h3>
          <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs font-light text-muted-foreground">By {article.author}</span>
            <span className="text-xs text-muted-foreground/60">{article.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
