
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type React from "react"
import { Inter } from "next/font/google"
import DashboardLayout from "@/components/layout/dashboard/dashboard-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Clouddojo - Practice Tests",
  description: "Prepare for your AWS certification exams with interactive practice questions",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] flex w-full h-full">
        {children}
    </div>
  )
}



