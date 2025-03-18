"use client"

import React from 'react'
import { Inter } from "next/font/google"
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { SiteHeader } from './site-header'


const inter = Inter({ subsets: ["latin"] })

const DashboardLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col ">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
        <SiteHeader />
            <div className={inter.className}>
              {children}
            </div>
          </SidebarInset>
        </div>
        </SidebarProvider>      
    </div>
  )
}

export default DashboardLayout
