"use client"

import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/layout/dashboard/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { UserButton } from "@clerk/nextjs"
import FeedbackDialog from "./feedback-dialog"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-white/30 bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-[--header-height] w-full items-center justify-between">
        <div className="gap-2 px-4 flex items-center">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4 data-[orientation=verticall]:h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-emerald-500">
                Dashboard 
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
        <div className="gap-4 px-4 flex items-center mr-6">
        <FeedbackDialog />
        <UserButton />
        </div>
      </div>
    </header>
  )
}
