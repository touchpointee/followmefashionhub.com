"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <AboutHero />

      {/* Our Story */}
      <OurStory />

      {/* Values */}
      <OurValues />

      {/* Team Section */}
      <TeamSection />

      <Footer />
    </main>
  )
}

function AboutHero() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const [heroData, setHeroData] = useState({ title: 'About Us', subtitle: 'Our Story', image: '/images/about-hero.jpg' })

  useEffect(() => {
    fetch('/api/content/pageHeroes')
      .then(res => res.json())
      .then(data => {
        if (data && data.aboutHero) {
          setHeroData({
            title: data.aboutHero.title || 'About Us',
            subtitle: data.aboutHero.subtitle || 'Our Story',
            image: data.aboutHero.image || '/images/about-hero.jpg'
          })
        }
      })
      .catch(console.error)
  }, [])

  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <Image
        src={heroData.image}
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
            {heroData.subtitle}
          </span>
          <h1 className="mt-4 text-4xl font-light tracking-wide text-primary-foreground md:text-6xl">
            {heroData.title}
          </h1>
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  const [imageRef, imageVisible] = useScrollAnimation<HTMLDivElement>()
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>()

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
              src="/images/about-brand.jpg"
              alt="Our atelier"
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
              Where Passion Meets <span className="font-medium">Purpose</span>
            </h2>
            <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-muted-foreground">
              <p>
                Follow Me Fashion Hub was born from a simple belief: that fashion should be a form of
                self-expression accessible to everyone who values quality and design.
              </p>
              <p>
                Founded in 2020, our brand emerged during a time when the world was reimagining what
                truly matters. We set out to create clothing that would become trusted companions in
                our customers lives—pieces that inspire confidence and stand the test of time.
              </p>
              <p>
                Today, we continue to honor that founding vision, designing collections that blend
                contemporary aesthetics with timeless elegance. Every garment we create is a
                testament to our commitment to quality, sustainability, and the art of dressing well.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OurValues() {
  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  const values = [
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
            What We Believe
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-4xl">
            Our Values
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
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

function TeamSection() {
  const [imageRef, imageVisible] = useScrollAnimation<HTMLDivElement>()
  const [contentRef, contentVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            ref={contentRef}
            className={`lg:order-1 ${contentVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
          >
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              The People
            </span>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-wide text-foreground md:text-4xl">
              Behind Every Design
            </h2>
            <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-muted-foreground">
              <p>
                Our team is a diverse collective of designers, artisans, and visionaries who share
                a common passion for fashion and excellence.
              </p>
              <p>
                From our design studio to our production facilities, every member of the Follow Me
                Fashion Hub family contributes their unique expertise to bring our collections to life.
              </p>
              <p>
                We believe that great fashion is the result of great collaboration, and we are proud
                to work with some of the most talented individuals in the industry.
              </p>
            </div>
          </div>

          <div
            ref={imageRef}
            className={`relative aspect-[4/3] overflow-hidden lg:order-2 ${imageVisible ? 'animate-slide-in-right' : 'opacity-0'
              }`}
          >
            <Image
              src="/images/team.jpg"
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
