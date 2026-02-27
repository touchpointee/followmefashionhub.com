import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your store settings and configuration.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>
                            Update your store's basic information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="store-name">Store Name</Label>
                            <Input id="store-name" defaultValue="Follow Me Fashion Hub" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-description">Description</Label>
                            <Textarea
                                id="store-description"
                                defaultValue="Luxury fashion brand showcasing editorial visuals, lookbooks, and contemporary style."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input id="support-email" type="email" defaultValue="support@followmefashionhub.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="support-phone">Support Phone</Label>
                                <Input id="support-phone" type="tel" defaultValue="+1 (555) 123-4567" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
