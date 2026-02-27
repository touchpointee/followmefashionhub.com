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
import Collection from '@/lib/models/Collection'

export const dynamic = 'force-dynamic'

export default async function CollectionsAdminPage() {
    await connectToDatabase()
    const dbCollections = await Collection.find({}).sort({ createdAt: -1 }).lean()

    const collections = dbCollections.map((c: any) => ({
        id: c._id.toString(),
        customId: c.id,
        name: c.name,
        season: c.season,
        year: c.year,
        image: c.image || null,
    }))

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                <Link href="/admin/collections/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Collection
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Season/Year</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No collections found. Add your first collection.
                                </TableCell>
                            </TableRow>
                        ) : (
                            collections.map((col) => (
                                <TableRow key={col.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                            <FallbackImage src={col.image || ''} alt={col.name} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{col.name}</TableCell>
                                    <TableCell>{col.season} {col.year}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/collections/${col.id}`}>Edit</Link>
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
