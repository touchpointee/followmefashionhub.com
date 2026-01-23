import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="Follow Me Fashion Hub"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-primary-foreground/70">
              A luxury fashion brand dedicated to contemporary elegance and timeless design.
              We believe in the power of fashion to inspire confidence and self-expression.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase">Explore</h4>
            <nav className="mt-6 flex flex-col gap-4">
              <Link
                href="/collections"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Collections
              </Link>
              <Link
                href="/journal"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Journal
              </Link>
              <Link
                href="/about"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm font-light text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium tracking-widest uppercase">Connect</h4>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-xs font-light text-primary-foreground/50">
            © {currentYear} Follow Me Fashion Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs font-light text-primary-foreground/50 transition-colors duration-300 hover:text-primary-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-light text-primary-foreground/50 transition-colors duration-300 hover:text-primary-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
