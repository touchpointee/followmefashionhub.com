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

export const getArticles = async (): Promise<Article[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/journal`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch (e) {
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/journal/${slug}`, { cache: 'no-store' })
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    return undefined
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const articles = await getArticles()
  return articles.map((article) => article.slug)
}
