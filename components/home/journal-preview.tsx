"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface JournalData {
  headerBadge?: string
  headerTitle?: string
  articles?: {
    slug: string
    title: string
    excerpt: string
    image: string
    date: string
    category: string
  }[]
}

const defaultArticles = [
  {
    slug: 'the-art-of-sustainable-fashion',
    title: 'The Art of Sustainable Fashion',
    excerpt: 'Exploring how conscious design choices are shaping the future of the fashion industry.',
    image: '/images/journal-1.jpg',
    date: 'January 15, 2026',
    category: 'Sustainability',
  },
  {
    slug: 'behind-the-scenes-spring-collection',
    title: 'Behind the Scenes: Spring Collection',
    excerpt: 'A glimpse into the creative process and inspiration behind our latest collection.',
    image: '/images/journal-2.jpg',
    date: 'January 10, 2026',
    category: 'Collections',
  },
  {
    slug: 'timeless-pieces-every-wardrobe-needs',
    title: 'Timeless Pieces Every Wardrobe Needs',
    excerpt: 'Our guide to building a versatile wardrobe with essential pieces that never go out of style.',
    image: '/images/journal-3.jpg',
    date: 'January 5, 2026',
    category: 'Style Guide',
  },
]

export function JournalPreview({ data }: { data?: JournalData }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  const activeArticles = data?.articles?.filter(a => a.title !== "").length ? data.articles.filter(a => a.title !== "") : defaultArticles

  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-16 flex flex-col items-center justify-between gap-6 md:flex-row ${headerVisible ? 'animate-fade-up' : 'opacity-0'
            }`}
        >
          <div>
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {data?.headerBadge || "From the Journal"}
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-5xl">
              {data?.headerTitle || "Latest Stories"}
            </h2>
          </div>
          <Link
            href="/journal"
            className="border-b border-foreground pb-1 text-sm font-light tracking-widest text-foreground uppercase transition-all duration-300 hover:border-muted-foreground hover:text-muted-foreground"
          >
            View All Articles
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {activeArticles.map((article, index) => (
            <ArticleCard key={index} article={article as any} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleCard({
  article,
  index,
}: {
  article: { slug?: string, title: string, excerpt: string, image: string, date: string, category: string }
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>()

  return (
    <article
      ref={ref}
      className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <Link href={article.slug ? `/journal/${article.slug}` : '#'}>
        <div className="image-hover-zoom relative aspect-[4/3] overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
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
        </div>
      </Link>
    </article>
  )
}
