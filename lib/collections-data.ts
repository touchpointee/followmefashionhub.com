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

export const getCollections = async (): Promise<Collection[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/collections`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    return []
  }
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/collections/${id}`, { cache: 'no-store' })
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    return undefined
  }
}

export async function getAllCollectionIds(): Promise<string[]> {
  const collections = await getCollections()
  return collections.map((c) => c.id)
}
