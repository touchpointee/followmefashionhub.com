"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'

interface LookbookData {
  headerBadge?: string
  headerTitle?: string
  images?: {
    caption: string
    image: string
  }[]
}

const defaultImages = [
  {
    image: '/images/lookbook-1.jpg',
    caption: 'Spring Collection 2026',
  },
  {
    image: '/images/lookbook-2.jpg',
    caption: 'Urban Edge Series',
  },
  {
    image: '/images/lookbook-3.jpg',
    caption: 'Timeless Essentials',
  },
]

export function LookbookSlider({ data }: { data?: LookbookData }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sectionRef, sectionVisible] = useScrollAnimation<HTMLElement>()

  const activeImages = data?.images?.filter(img => img.image !== "").length ? data.images.filter(img => img.image !== "") : defaultImages

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeImages.length) % activeImages.length)
  }

  return (
    <section
      ref={sectionRef}
      className={`bg-background py-24 md:py-32 ${sectionVisible ? 'animate-fade-in' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {data?.headerBadge || "Editorial"}
          </span>
          <h2 className="mt-4 text-3xl font-light tracking-wide text-foreground md:text-5xl">
            {data?.headerTitle || "Lookbook"}
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
            {activeImages.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                    ? 'scale-100 opacity-100'
                    : 'scale-105 opacity-0'
                  }`}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.caption}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                  <p className="text-lg font-light tracking-wide text-primary-foreground md:text-2xl">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 p-3 text-foreground transition-all duration-300 hover:bg-background"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 p-3 text-foreground transition-all duration-300 hover:bg-background"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-3">
            {activeImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2 transition-all duration-300 ${index === currentSlide
                    ? 'w-8 bg-foreground'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
