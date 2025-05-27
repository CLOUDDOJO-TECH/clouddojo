"use client"

import { Sparkles } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { usePricingModal } from "./providers/pricing-modal-provider"
import { cn } from "@/lib/utils"

interface UpgradeButtonProps extends ButtonProps {
  showIcon?: boolean
  label?: string
}

export default function UpgradeButton({ 
  className, 
  showIcon = true, 
  label = "Upgrade", 
  ...props 
}: UpgradeButtonProps) {
  const { openPricingModal } = usePricingModal()
  
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-purple-500 to-purple-500/40 text-white hover:from-purple-600 hover:to-purple-600/40 rounded-full",
        className
      )}
      onClick={openPricingModal}
      {...props}
    >
      {showIcon && <Sparkles className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  )
} 