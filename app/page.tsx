import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { AboutSection } from '@/components/home/about-section'
import { LookbookSlider } from '@/components/home/lookbook-slider'
import { JournalPreview } from '@/components/home/journal-preview'
import { VisualBreakSection } from '@/components/home/visual-break-section'
import { ImageGallery } from '@/components/home/image-gallery'
import { NewsletterSection } from '@/components/home/newsletter-section'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedCollections />
      <AboutSection />
      <LookbookSlider />
      <JournalPreview />
      <VisualBreakSection />
      <ImageGallery />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
