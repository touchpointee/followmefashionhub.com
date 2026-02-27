"use client"

import React from "react"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { MapPin, Mail, Phone, Check } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <ContactHero />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </main>
  )
}

function ContactHero() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const [heroData, setHeroData] = useState({ title: 'Contact Us', subtitle: 'We would love to hear from you. Whether you have a question about our collections, need assistance, or simply want to share your thoughts, we are here to help.', image: '' })

  useEffect(() => {
    fetch('/api/content/pageHeroes')
      .then(res => res.json())
      .then(data => {
        if (data && data.contactHero) {
          setHeroData({
            title: data.contactHero.title || 'Contact Us',
            subtitle: data.contactHero.subtitle || 'We would love to hear from you. Whether you have a question about our collections, need assistance, or simply want to share your thoughts, we are here to help.',
            image: data.contactHero.image || ''
          })
        }
      })
      .catch(console.error)
  }, [])

  return (
    <section className="relative bg-primary pt-32 pb-20">
      {heroData.image && (
        <Image
          src={heroData.image}
          alt="Contact Hero"
          fill
          className="object-cover opacity-20"
          priority
        />
      )}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div
          ref={ref}
          className={`text-center ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
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
  )
}

function ContactSection() {
  const [formRef, formVisible] = useScrollAnimation<HTMLDivElement>()
  const [infoRef, infoVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Contact Form */}
          <div
            ref={formRef}
            className={`${formVisible ? 'animate-slide-in-left' : 'opacity-0'}`}
          >
            <h2 className="text-2xl font-light tracking-wide text-foreground md:text-3xl">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div
            ref={infoRef}
            className={`${infoVisible ? 'animate-slide-in-right' : 'opacity-0'}`}
          >
            <h2 className="text-2xl font-light tracking-wide text-foreground md:text-3xl">
              Get in touch
            </h2>
            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary">
                  <MapPin size={20} className="text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wide text-foreground">Visit Us</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                    123 Fashion Avenue<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary">
                  <Mail size={20} className="text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wide text-foreground">Email Us</h3>
                  <p className="mt-2 text-sm font-light text-muted-foreground">
                    hello@followmefashionhub.com
                  </p>
                  <p className="text-sm font-light text-muted-foreground">
                    press@followmefashionhub.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary">
                  <Phone size={20} className="text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium tracking-wide text-foreground">Call Us</h3>
                  <p className="mt-2 text-sm font-light text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                  <p className="text-xs font-light text-muted-foreground/60">
                    Mon - Fri, 9am - 6pm EST
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-12 border-t border-border pt-8">
              <h3 className="text-sm font-medium tracking-wide text-foreground">Business Hours</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm font-light">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (isSubmitted) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center bg-foreground">
          <Check size={32} className="text-background" />
        </div>
        <h3 className="mt-6 text-xl font-light tracking-wide text-foreground">Message Sent</h3>
        <p className="mt-4 text-sm font-light text-muted-foreground">
          Thank you for reaching out. We will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-8 border border-foreground px-8 py-4 text-xs font-medium tracking-widest text-foreground uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="collections">Collections</option>
          <option value="press">Press & Media</option>
          <option value="careers">Careers</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="mt-2 w-full resize-none border border-border bg-transparent px-4 py-3 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        className="w-full border border-foreground bg-foreground px-8 py-4 text-xs font-medium tracking-widest text-background uppercase transition-all duration-300 hover:bg-transparent hover:text-foreground md:w-auto"
      >
        Send Message
      </button>
    </form>
  )
}
