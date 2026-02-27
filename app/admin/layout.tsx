import React from 'react'
import { AdminSidebar } from './admin-sidebar'

export const metadata = {
  title: 'Admin Panel | Follow Me Fashion Hub',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-6 shadow-sm">
          <h1 className="text-base font-semibold text-slate-700 tracking-tight">Admin Panel</h1>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
