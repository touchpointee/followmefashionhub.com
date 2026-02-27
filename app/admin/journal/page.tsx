import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import Link from 'next/link'
import FallbackImage from '@/components/admin/fallback-image'
import connectToDatabase from '@/lib/mongodb'
import Journal from '@/lib/models/Journal'

export const dynamic = 'force-dynamic'

export default async function JournalAdminPage() {
    await connectToDatabase()
    const dbArticles = await Journal.find({}).sort({ createdAt: -1 }).lean()

    const articles = dbArticles.map((a: any) => ({
        id: a._id.toString(),
        slug: a.slug,
        title: a.title,
        category: a.category,
        date: a.date,
        image: a.image || null,
    }))

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Journal Articles</h1>
                <Link href="/admin/journal/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Article
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No articles found. Add your first article.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((art) => (
                                <TableRow key={art.slug}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                            <FallbackImage src={art.image || ''} alt={art.title} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{art.title}</TableCell>
                                    <TableCell>{art.category}</TableCell>
                                    <TableCell>{art.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/journal/${art.id}`}>Edit</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
