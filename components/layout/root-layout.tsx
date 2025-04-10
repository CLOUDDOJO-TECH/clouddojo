"use client"

import type React from "react"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import SidebarComponent from "@/components/Sidebar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#0B0F1A]">
      <SidebarComponent />
      <div className="flex flex-1 flex-col overflow-hidden">
        <NavHeader />
        <main className="flex-1 overflow-auto bg-[#0B0F1A]">
          <div className="container mx-auto py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

