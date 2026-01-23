"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const [titleRef, titleVisible] = useScrollAnimation<HTMLHeadingElement>()
  const [subtitleRef, subtitleVisible] = useScrollAnimation<HTMLParagraphElement>()
  const [ctaRef, ctaVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1920&q=80"
          alt="Men's fashion store"
          fill
          className="object-cover brightness-[0.7]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className={`max-w-4xl text-5xl font-light leading-tight tracking-wider text-white md:text-7xl lg:text-8xl ${titleVisible ? 'animate-fade-up' : 'opacity-0'
            }`}
        >
          <span className="block text-balance">Modern Men&apos;s</span>
          <span className="mt-2 block font-semibold text-balance">Fashion</span>
        </h1>

        <p
          ref={subtitleRef}
          className={`mt-8 max-w-xl text-lg font-light leading-relaxed tracking-wide text-white/90 md:text-xl ${subtitleVisible ? 'animate-fade-up delay-200' : 'opacity-0'
            }`}
        >
          Explore Our New Store Opening in Kaniyapuram.
          Where style meets substance.
        </p>

        <div
          ref={ctaRef}
          className={`mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 ${ctaVisible ? 'animate-fade-up delay-400' : 'opacity-0'
            }`}
        >
          <Link
            href="/collections"
            className="group flex items-center gap-2 border border-white bg-white px-8 py-4 text-xs font-bold tracking-widest text-black uppercase transition-all duration-300 hover:bg-transparent hover:text-white"
          >
            Shop Collection
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="group flex items-center gap-2 border border-white px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:bg-white hover:text-black"
          >
            Visit Store
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-light tracking-widest text-primary-foreground/70 uppercase">Scroll</span>
          <div className="h-12 w-px animate-pulse bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  )
}
