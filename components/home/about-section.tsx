"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface AboutData {
  badge?: string
  titleLine1?: string
  titleLine2?: string
  paragraph1?: string
  paragraph2?: string
  testimonial?: string
  ctaLabel?: string
  sideImage?: string
}

export function AboutSection({ data }: { data?: AboutData }) {
  const [imageRef, imageVisible] = useScrollAnimation<HTMLDivElement>()
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>()

  const bgImage = data?.sideImage || "https://images.unsplash.com/photo-1678547241895-1c307914b50c?auto=format&fit=crop&w=612&h=464&q=80"

  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div
            ref={imageRef}
            className={`relative aspect-[4/5] overflow-hidden ${imageVisible ? 'animate-slide-in-left' : 'opacity-0'
              }`}
          >
            <Image
              src={bgImage}
              alt="Follow Me Store Interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className={`${contentVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
          >
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {data?.badge || "About Follow Me"}
            </span>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-wide text-foreground md:text-4xl">
              {data?.titleLine1 || "Discover Your Unique"} <span className="font-medium">{data?.titleLine2 || "Style"}</span>
            </h2>
            <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-muted-foreground">
              <p>
                {data?.paragraph1 || "At Follow Me, we offer the latest in men's fashion, with two stores in Trivandrum and a new location opening soon in Kaniyapuram."}
              </p>
              <p>
                {data?.paragraph2 || "Our Trivandrum-based store specializes in men's fashion, providing stylish and trendy options for every occasion. Visit us to elevate your wardrobe."}
              </p>
              <p>
                {data?.testimonial || "The quality is outstanding, and the staff is incredibly helpful. Highly recommend shopping here! - Shareef"}
              </p>
            </div>
            <Link
              href="/about"
              className="mt-10 inline-block border border-foreground px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              {data?.ctaLabel || "Visit Our Stores"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
