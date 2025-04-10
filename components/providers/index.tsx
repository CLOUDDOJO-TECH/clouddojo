"use client"

import React from "react"
import { QueryProvider } from "./query-provider"
import { PricingModalProvider } from "./pricing-modal-provider"
import { ThemeProvider } from "next-themes"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <PricingModalProvider>
          {children}
        </PricingModalProvider>
      </QueryProvider>
    </ThemeProvider>
  )
} 