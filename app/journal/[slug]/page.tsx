"use client"

import React from "react"

import { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getArticles, getArticleBySlug, Article } from '@/lib/journal-data'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowLeft } from 'lucide-react'

export default function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticleBySlug(slug)
      .then(data => {
        setArticle(data || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <main className="min-h-screen pt-32"><div className="text-center">Loading...</div></main>

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <ArticleHero article={article} />

      {/* Article Content */}
      <ArticleContent article={article} />

      {/* Related Articles */}
      <RelatedArticles currentSlug={article.slug} />

      <Footer />
    </main>
  )
}

function ArticleHero({ article }: { article: any }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  if (!article) return null

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src={article.image || "/placeholder.svg"}
        alt={article.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/60" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          ref={ref}
          className={`max-w-3xl ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="flex items-center justify-center gap-4">
            <span className="text-xs font-medium tracking-widest text-primary-foreground/70 uppercase">
              {article.category}
            </span>
            <span className="text-xs text-primary-foreground/50">{article.date}</span>
          </div>
          <h1 className="mt-6 text-3xl font-light leading-tight tracking-wide text-primary-foreground md:text-5xl text-balance">
            {article.title}
          </h1>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-sm font-light text-primary-foreground/70">By {article.author}</span>
            <span className="text-sm text-primary-foreground/50">{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/journal"
        className="absolute left-6 top-28 flex items-center gap-2 text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
      >
        <ArrowLeft size={16} />
        Back to Journal
      </Link>
    </section>
  )
}

function ArticleContent({ article }: { article: any }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  if (!article) return null

  // Parse content to render markdown-like formatting
  const renderContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ')
        elements.push(
          <p key={elements.length} className="text-base font-light leading-relaxed text-muted-foreground">
            {text}
          </p>
        )
        currentParagraph = []
      }
    }

    lines.forEach((line: string) => {
      const trimmedLine = line.trim()

      if (trimmedLine === '') {
        flushParagraph()
      } else if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        elements.push(
          <h2 key={elements.length} className="mt-12 mb-6 text-xl font-medium tracking-wide text-foreground">
            {trimmedLine.replace('## ', '')}
          </h2>
        )
      } else if (trimmedLine.startsWith('> ')) {
        flushParagraph()
        elements.push(
          <blockquote
            key={elements.length}
            className="my-10 border-l-2 border-foreground pl-8 text-lg font-light italic leading-relaxed text-foreground/80"
          >
            {trimmedLine.replace('> ', '')}
          </blockquote>
        )
      } else if (trimmedLine.startsWith('**') && trimmedLine.includes('** -')) {
        flushParagraph()
        const [title, desc] = trimmedLine.split('** -')
        elements.push(
          <p key={elements.length} className="mt-4 text-base font-light leading-relaxed text-muted-foreground">
            <strong className="font-medium text-foreground">{title.replace('**', '')}</strong> - {desc}
          </p>
        )
      } else {
        currentParagraph.push(trimmedLine)
      }
    })

    flushParagraph()
    return elements
  }

  return (
    <section className="bg-background py-20 md:py-32">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-6 lg:px-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      >
        <div className="space-y-6">{renderContent(article.content)}</div>

        {/* Share Section */}
        <div className="mt-16 border-t border-border pt-8">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Share this article
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])

  useEffect(() => {
    getArticles().then(data => {
      setRelatedArticles(data.filter((a) => a.slug !== currentSlug).slice(0, 2))
    })
  }, [currentSlug])

  return (
    <section className="bg-secondary py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-12 ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <h2 className="text-2xl font-light tracking-wide text-foreground">
            Continue Reading
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {relatedArticles.map((article, index) => (
            <RelatedArticleCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedArticleCard({
  article,
  index,
}: {
  article: any
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
        <div className="image-hover-zoom relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground/60">{article.date}</span>
          </div>
          <h3 className="mt-3 text-xl font-medium leading-tight tracking-wide text-foreground transition-colors duration-300 group-hover:text-muted-foreground">
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
