import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import connectToDatabase from '@/lib/mongodb'
import SiteContent from '@/lib/models/SiteContent'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Terms of Service | Follow Me Fashion Hub',
    description: 'Our terms and conditions of service.',
}

export default async function TermsPage() {
    await connectToDatabase()
    const dbRecord = await SiteContent.findOne({ section: 'legalPages' }).lean()
    const content = dbRecord?.data?.terms || 'These are the terms of service. Please update this content in the Admin Dashboard.'

    return (
        <main className="min-h-screen">
            <Header />
            <section className="bg-primary pt-32 pb-20">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center animate-fade-up">
                    <h1 className="text-4xl font-light tracking-wide text-primary-foreground md:text-5xl">
                        Terms of Service
                    </h1>
                </div>
            </section>

            <section className="bg-background py-20 pb-32">
                <div className="mx-auto max-w-3xl px-6 lg:px-8">
                    <div className="prose prose-neutral dark:prose-invert max-w-none font-light leading-relaxed whitespace-pre-wrap">
                        {content}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}
