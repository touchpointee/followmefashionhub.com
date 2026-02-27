"use client"

import * as React from "react"
import { LayoutDashboard, Package, FileText, Users, Settings } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Products", url: "/admin/products", icon: Package },
    { title: "Home Banner", url: "/admin/content", icon: FileText },
    { title: "Page Heroes", url: "/admin/content?tab=pageHeroes", icon: FileText },
    { title: "About Section", url: "/admin/content?tab=about", icon: FileText },
    { title: "Collections CTA", url: "/admin/content?tab=featured", icon: FileText },
    { title: "Gallery & More", url: "/admin/content?tab=gallery", icon: FileText },
    { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
                                    <LayoutDashboard className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Admin Panel</span>
                                    <span className="truncate text-xs">Follow Me Fashion</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu className="mt-4 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.url || (pathname.startsWith(item.url + '/') && item.url !== '/admin')
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                {/* Could add a user profile section here */}
            </SidebarFooter>
        </Sidebar>
    )
}
