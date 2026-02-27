"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Package,
    FileText,
    Users,
    Settings,
    MessageSquare,
    Home,
    Info,
    Phone,
    SlidersHorizontal,
    BookOpen,
} from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

const navItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
    { title: "Products", url: "/admin/products", icon: Package },
    { title: "Collections", url: "/admin/collections", icon: BookOpen },
    { title: "Messages", url: "/admin/messages", icon: MessageSquare },
    { title: "Journal", url: "/admin/journal", icon: FileText },
    { title: "Homepage Portions", url: "/admin/homepage", icon: Home },
    { title: "About Page", url: "/admin/about-page", icon: Info },
    { title: "Contact Page", url: "/admin/contact-page", icon: Phone },
    { title: "Pages Settings", url: "/admin/pages", icon: SlidersHorizontal },
    { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ ...props }: React.ComponentProps<"aside">) {
    const pathname = usePathname()

    return (
        <aside
            className="flex flex-col h-screen w-64 shrink-0 bg-slate-900 text-slate-100 border-r border-slate-800"
            {...props}
        >
            {/* Logo / Brand */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg text-white shadow" style={{ backgroundColor: '#34475d' }}>
                    <LayoutDashboard className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">Admin Panel</p>
                    <p className="text-xs text-slate-400">Follow Me Fashion</p>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.url
                        : pathname === item.url || pathname.startsWith(item.url + '/')

                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                                isActive
                                    ? "text-white shadow-sm"
                                    : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                            )}
                            style={isActive ? { backgroundColor: '#34475d' } : {}}
                        >
                            <item.icon className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                            )} />
                            <span className="truncate">{item.title}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#34475d' }}>
                        N
                    </div>
                    <div className="leading-tight">
                        <p className="text-xs font-medium text-slate-300">Administrator</p>
                        <p className="text-xs text-slate-500">Signed in</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
