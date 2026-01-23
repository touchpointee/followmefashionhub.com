"use client"

import React from "react"

import { useState } from 'react'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [sectionRef, sectionVisible] = useScrollAnimation<HTMLElement>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`bg-primary py-24 md:py-32 ${sectionVisible ? 'animate-fade-in' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <span className="text-xs font-medium tracking-widest text-primary-foreground/60 uppercase">
          Stay Connected
        </span>
        <h2 className="mt-4 text-3xl font-light tracking-wide text-primary-foreground md:text-4xl">
          Join Our World
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-primary-foreground/70">
          Subscribe to receive exclusive updates on new collections, 
          behind-the-scenes content, and special editorial features.
        </p>

        {isSubmitted ? (
          <div className="mt-10 flex items-center justify-center gap-3 text-primary-foreground">
            <Check size={20} />
            <span className="text-sm font-light">Thank you for subscribing</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 border border-primary-foreground/30 bg-transparent px-6 py-4 text-sm font-light text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 border border-primary-foreground bg-primary-foreground px-8 py-4 text-xs font-medium tracking-widest text-primary uppercase transition-all duration-300 hover:bg-transparent hover:text-primary-foreground sm:border-l-0"
              >
                Subscribe
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
