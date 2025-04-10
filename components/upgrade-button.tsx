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
        "bg-gradient-to-r from-emerald-500 to-emerald-500/40 text-white hover:from-emerald-600 hover:to-emerald-600/40",
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