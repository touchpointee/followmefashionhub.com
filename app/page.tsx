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
import Collection from '@/lib/models/Collection'

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
  const [heroData, aboutData, breakData, lookbookData, journalData, galleryData] =
    await Promise.all([
      getCMSData('hero'),
      getCMSData('about'),
      getCMSData('visualBreak'),
      getCMSData('lookbook'),
      getCMSData('journal'),
      getCMSData('gallery'),
    ])

  await connectToDatabase()
  const latestCollections = await Collection.find({}).sort({ createdAt: -1 }).limit(3).lean()
  // Clean up MongoDB _id for client component
  const realCollections = latestCollections.map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.shortDescription || c.description || '',
    image: c.image || c.heroImage || null,
  }))

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection data={heroData} />
      <FeaturedCollections latestCollections={realCollections} />
      <AboutSection data={aboutData} />
      <LookbookSlider data={lookbookData} />
      <JournalPreview data={journalData} />
      <VisualBreakSection data={breakData} />
      <ImageGallery data={galleryData} />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
