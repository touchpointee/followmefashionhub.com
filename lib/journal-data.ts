export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
  author: string
  readTime: string
}

export const articles: Article[] = [
  {
    slug: 'the-art-of-sustainable-fashion',
    title: 'The Art of Sustainable Fashion',
    excerpt: 'Exploring how conscious design choices are shaping the future of the fashion industry.',
    content: `The fashion industry stands at a pivotal moment in its history. As global awareness of environmental impact grows, designers and brands are reimagining how clothing is created, consumed, and ultimately recycled.

At Follow Me Fashion Hub, sustainability isn't just a trend—it's a fundamental principle that guides every decision we make. From sourcing organic and recycled materials to implementing zero-waste pattern cutting techniques, our approach to fashion considers the entire lifecycle of each garment.

## Conscious Materials

The journey toward sustainable fashion begins with the materials we choose. We prioritize organic cotton, recycled polyester, and innovative fabrics made from regenerated fibers. Each material is carefully vetted for its environmental footprint, ensuring that beauty never comes at the cost of our planet.

> "True luxury in the 21st century means knowing that your clothing choices contribute to a better world, not detract from it."

## Ethical Production

Beyond materials, sustainable fashion demands ethical production practices. Our manufacturing partners share our commitment to fair wages, safe working conditions, and transparent supply chains. We believe that the hands that create our garments deserve as much respect as the people who wear them.

## The Future of Fashion

The sustainable fashion movement represents more than an industry shift—it's a cultural transformation. Consumers are increasingly choosing quality over quantity, investing in pieces that will last for years rather than seasons.

As we look to the future, we see a fashion industry that celebrates craftsmanship, respects natural resources, and empowers both creators and consumers to make choices that align with their values. This is the future we're building, one garment at a time.`,
    image: '/images/journal-1.jpg',
    date: 'January 15, 2026',
    category: 'Sustainability',
    author: 'Sarah Chen',
    readTime: '5 min read',
  },
  {
    slug: 'behind-the-scenes-spring-collection',
    title: 'Behind the Scenes: Spring Collection',
    excerpt: 'A glimpse into the creative process and inspiration behind our latest collection.',
    content: `Every collection begins with a spark—an image, a feeling, a moment captured in time. For our Spring Awakening collection, that spark came during a morning walk through a botanical garden, where the first flowers of spring were emerging from their winter slumber.

## The Inspiration

Nature's rebirth became our muse. We studied the way petals unfold, the gradient of colors in a sunrise, the delicate balance between structure and flow in a blooming flower. These observations would eventually translate into the flowing silhouettes and soft color palettes that define this collection.

## From Sketch to Reality

Our design team spent weeks translating these inspirations into sketches, experimenting with proportions, and testing fabric drapes. The process is iterative—each design goes through multiple revisions as we refine the vision.

> "Fashion design is a conversation between the designer's vision and the material's possibilities. The best designs emerge when both parties listen to each other."

## The Fabric Selection

Choosing the right fabrics is perhaps the most crucial step in bringing a collection to life. For Spring Awakening, we sought materials that would capture the lightness and movement of spring. Silk organza, cotton voile, and recycled cashmere became our primary players, each chosen for its ability to embody the season's spirit.

## The Final Touches

The finishing details—buttons, stitching, hardware—might seem minor, but they make all the difference. We source these elements with the same care we give to our main fabrics, ensuring that every aspect of each garment reflects our commitment to quality and thoughtful design.

The result is a collection that we hope captures the optimism and renewal that spring represents—pieces that make the wearer feel as refreshed and revitalized as the season itself.`,
    image: '/images/journal-2.jpg',
    date: 'January 10, 2026',
    category: 'Collections',
    author: 'Michael Torres',
    readTime: '7 min read',
  },
  {
    slug: 'timeless-pieces-every-wardrobe-needs',
    title: 'Timeless Pieces Every Wardrobe Needs',
    excerpt: 'Our guide to building a versatile wardrobe with essential pieces that never go out of style.',
    content: `In an era of fast fashion and fleeting trends, there's profound wisdom in building a wardrobe centered around timeless pieces. These are the garments that transcend seasons, effortlessly transitioning from one year to the next while always looking fresh and relevant.

## The Philosophy of Less

Building a timeless wardrobe isn't about having fewer clothes—it's about having the right clothes. Each piece should earn its place by offering versatility, quality, and enduring style. When you invest in well-made basics, getting dressed becomes simpler, more sustainable, and infinitely more satisfying.

## Essential Foundations

Every great wardrobe starts with impeccable basics:

**The Perfect White Shirt** - Crisp, well-fitted, and versatile enough to dress up or down. Look for quality cotton with thoughtful details like mother-of-pearl buttons and clean seams.

**Tailored Trousers** - A well-cut pair of trousers in a neutral color forms the foundation of countless outfits. The fit should be comfortable yet refined.

**The Classic Blazer** - Nothing elevates an outfit quite like a beautifully tailored blazer. Choose a neutral color and timeless cut that will serve you for years.

> "Quality is remembered long after price is forgotten." — Gucci

## The Art of Mixing

Timeless dressing isn't about wearing the same things repeatedly—it's about creative combination. A classic blazer becomes fresh with unexpected accessories. A white shirt transforms with different styling techniques. The same trousers work for the office and weekend brunch with simple adjustments.

## Investing Wisely

Timeless pieces often require a greater initial investment, but the cost-per-wear calculation quickly favors quality. A well-made garment that lasts five years and is worn regularly represents far better value than a cheap alternative that loses its shape after a few washes.

At Follow Me Fashion Hub, we design with longevity in mind. Our pieces are created to become the trusted companions of your wardrobe—garments you reach for again and again, always confident in how they make you look and feel.`,
    image: '/images/journal-3.jpg',
    date: 'January 5, 2026',
    category: 'Style Guide',
    author: 'Emma Williams',
    readTime: '6 min read',
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug)
}
