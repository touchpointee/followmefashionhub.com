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

import connectToDatabase from '@/lib/mongodb'
import SiteContent from '@/lib/models/SiteContent'

export const dynamic = 'force-dynamic' // Ensure homepage fetches fresh CMS data

async function getCMSData(section: string) {
  try {
    await connectToDatabase()
    const content = await SiteContent.findOne({ section }).lean()
    return content ? content.data : {}
  } catch (e) {
    console.error(`Failed to fetch CMS data for ${section}`, e)
    return {}
  }
}

export default async function HomePage() {
  const heroData = await getCMSData('hero')
  const aboutData = await getCMSData('about')

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection data={heroData} />
      <FeaturedCollections />
      <AboutSection data={aboutData} />
      <LookbookSlider />
      <JournalPreview />
      <VisualBreakSection />
      <ImageGallery />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
