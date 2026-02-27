"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function AboutPage() {
  const [aboutPageData, setAboutPageData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/content/aboutPage?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setAboutPageData(data)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <AboutHero data={aboutPageData?.hero} />

      {/* Our Story */}
      <OurStory data={aboutPageData?.story} />

      {/* Values */}
      <OurValues data={aboutPageData?.values} />

      {/* Team Section */}
      <TeamSection data={aboutPageData?.team} />

      <Footer />
    </main>
  )
}

function AboutHero({ data }: { data?: any }) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  const title = data?.title || 'About Us'
  const subtitle = data?.subtitle || 'Our Story'
  const image = data?.image || '/images/about-hero.jpg'

  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <Image
        src={image}
        alt="Follow Me Fashion Hub studio"
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
            {subtitle}
          </span>
          <h1 className="mt-4 text-4xl font-light tracking-wide text-primary-foreground md:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}

function OurStory({ data }: { data?: any }) {
  const [imageRef, imageVisible] = useScrollAnimation<HTMLDivElement>()
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>()

  const titlePart1 = data?.titlePart1 || 'Where Passion Meets '
  const titlePart2 = data?.titlePart2 || 'Purpose'
  const image = data?.image || '/images/about-brand.jpg'
  const paragraphs = data?.content
    ? data.content.split('\n').filter((p: string) => p.trim() !== '')
    : [
      'Follow Me Fashion Hub was born from a simple belief: that fashion should be a form of self-expression accessible to everyone who values quality and design.',
      'Founded in 2020, our brand emerged during a time when the world was reimagining what truly matters. We set out to create clothing that would become trusted companions in our customers lives—pieces that inspire confidence and stand the test of time.',
      'Today, we continue to honor that founding vision, designing collections that blend contemporary aesthetics with timeless elegance. Every garment we create is a testament to our commitment to quality, sustainability, and the art of dressing well.'
    ]

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            ref={imageRef}
            className={`relative aspect-[4/5] overflow-hidden ${imageVisible ? 'animate-slide-in-left' : 'opacity-0'
              }`}
          >
            <Image
              src={image}
              alt="Our story"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div
            ref={contentRef}
            className={`${contentVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
          >
            <h2 className="text-3xl font-light leading-tight tracking-wide text-foreground md:text-4xl">
              {titlePart1}<span className="font-medium">{titlePart2}</span>
            </h2>
            <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-muted-foreground">
              {paragraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OurValues({ data }: { data?: any }) {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  const badge = data?.badge || 'What We Believe'
  const title = data?.title || 'Our Values'
  const values = data?.items || [
    {
      title: 'Quality',
      description: 'We believe in creating garments that last. Every stitch, every seam, every detail is crafted with precision and care.',
    },
    {
      title: 'Sustainability',
      description: 'Our commitment to the environment guides our material choices and production processes, ensuring fashion that respects our planet.',
    },
    {
      title: 'Timelessness',
      description: 'We design pieces that transcend trends, offering enduring style that remains relevant season after season.',
    },
    {
      title: 'Craftsmanship',
      description: 'Our skilled artisans bring decades of experience to every garment, honoring traditional techniques while embracing innovation.',
    },
  ]

  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`mb-16 text-center ${headerVisible ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {badge}
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-4xl">
            {title}
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value: any, index: number) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueCard({
  value,
  index,
}: {
  value: { title: string; description: string }
  index: number
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <h3 className="text-lg font-medium tracking-wide text-foreground">{value.title}</h3>
      <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
        {value.description}
      </p>
    </div>
  )
}

function TeamSection({ data }: { data?: any }) {
  const [imageRef, imageVisible] = useScrollAnimation<HTMLDivElement>()
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>()

  const badge = data?.badge || 'The People'
  const title = data?.title || 'Behind Every Design'
  const image = data?.image || '/images/team.jpg'
  const paragraphs = data?.content
    ? data.content.split('\n').filter((p: string) => p.trim() !== '')
    : [
      'Our team is a diverse collective of designers, artisans, and visionaries who share a common passion for fashion and excellence.',
      'From our design studio to our production facilities, every member of the Follow Me Fashion Hub family contributes their unique expertise to bring our collections to life.',
      'We believe that great fashion is the result of great collaboration, and we are proud to work with some of the most talented individuals in the industry.'
    ]

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            ref={contentRef}
            className={`lg:order-1 ${contentVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
          >
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {badge}
            </span>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-wide text-foreground md:text-4xl">
              {title}
            </h2>
            <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-muted-foreground">
              {paragraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div
            ref={imageRef}
            className={`relative aspect-[4/3] overflow-hidden lg:order-2 ${imageVisible ? 'animate-slide-in-right' : 'opacity-0'
              }`}
          >
            <Image
              src={image}
              alt="Our team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
