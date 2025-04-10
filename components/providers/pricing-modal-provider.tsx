"use client"

import React, { createContext, useContext, useState } from "react"
import PricingModal from "@/components/pricing-modal"

// Create context with open/close functionality
type PricingModalContextType = {
  openPricingModal: () => void
  closePricingModal: () => void
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(undefined)

// Hook to use the pricing modal context
export function usePricingModal() {
  const context = useContext(PricingModalContext)
  if (!context) {
    throw new Error("usePricingModal must be used within a PricingModalProvider")
  }
  return context
}

// Provider component
export function PricingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPricingModal = () => setIsOpen(true)
  const closePricingModal = () => setIsOpen(false)

  return (
    <PricingModalContext.Provider value={{ openPricingModal, closePricingModal }}>
      {children}
      
      <PricingModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        trigger={null}
      />
    </PricingModalContext.Provider>
  )
} 