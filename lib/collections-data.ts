export interface Collection {
  id: string
  name: string
  description: string
  longDescription: string
  image: string
  heroImage: string
  gallery: string[]
  season: string
  year: string
}

export const collections: Collection[] = [
  {
    id: 'mens-trends',
    name: "Men's Trends",
    description: 'Contemporary styles for the modern man',
    longDescription: `Define your presence with our Men's Trends collection. Curated for the modern man who values both aesthetics and functionality, these pieces seamlessly blend contemporary design with classic tailoring.
    
    Our selection focuses on versatile wardrobe staples that transition effortlessly from the boardroom to evening social gatherings. Expect streamlined silhouettes, premium fabrics, and a sophisticated color palette that exudes confidence.
    
    Whether you are looking for smart casual essentials or statement pieces to elevate your look, this collection offers the perfect balance of style and substance.`,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    ],
    season: 'Fall/Winter',
    year: '2025',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'The finishing touches defined by detail',
    longDescription: `Elevate your ensemble with our diverse range of Accessories. We believe that true style is born in the details, and our collection provides the perfect finishing touches for any outfit.
    
    From handcrafted leather belts and wallets to sleek watches and sunglasses, every item is chosen for its quality and design. These accessories are not just add-ons; they are statements of personal style.
    
    Explore our collection to find pieces that complement your unique look, adding a layer of sophistication and individuality to your daily wardrobe.`,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',

    ],
    season: 'Year Round',
    year: '2025',
  },
  {
    id: 'footwear',
    name: 'Footwear',
    description: 'Steps towards timeless elegance',
    longDescription: `Step out in style with our premium Footwear collection. Designed for the discerning gentleman, our range features everything from classic leather oxfords to contemporary sneakers.
    
    Each pair is crafted with comfort and durability in mind, ensuring that you look good and feel great all day long. We source the finest materials to construct shoes that stand the test of time.
    
    Whether you're dressing for a formal occasion or a casual weekend, our footwear provides the foundation for a polished and confident appearance.`,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1920&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    ],
    season: 'Spring/Summer',
    year: '2025',
  },
]

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}

export function getAllCollectionIds(): string[] {
  return collections.map((collection) => collection.id)
}
