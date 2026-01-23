"use client"

import Image from 'next/image'
import { useScrollAnimation, useParallax } from '@/hooks/use-scroll-animation'

export function VisualBreakSection() {
  const [textRef, textVisible] = useScrollAnimation<HTMLDivElement>()
  const [parallaxRef, offset] = useParallax(0.3)

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <Image
          src="/images/visual-break.jpg"
          alt="Fashion editorial"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div
          ref={textRef}
          className={`max-w-4xl text-center ${textVisible ? 'animate-scale-in' : 'opacity-0'}`}
        >
          <p className="text-lg font-light leading-relaxed tracking-wide text-primary-foreground/80 md:text-xl">
            &ldquo;Fashion is not something that exists in dresses only. Fashion is in the sky, 
            in the street. Fashion has to do with ideas, the way we live, what is happening.&rdquo;
          </p>
          <p className="mt-8 text-sm font-medium tracking-widest text-primary-foreground uppercase">
            — Coco Chanel
          </p>
        </div>
      </div>
    </section>
  )
}
