"use client"

import type React from "react"

import { Crown, Sparkles, Zap, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { usePricingModal } from "../providers/pricing-modal-provider"
import { useRouter } from "next/navigation"

interface UpgradeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "primary" | "secondary" | "premium" | "electric"
  icon?: "crown" | "sparkles" | "zap" | "star" | "none"
  children?: React.ReactNode
}

const UpgradeButton = forwardRef<HTMLButtonElement, UpgradeButtonProps>(
  ({ className, size = "sm", variant = "primary", icon = "crown", children = "Upgrade", ...props }, ref) => {

    const { openPricingModal} = usePricingModal()
    const sizeClasses = {
      sm: "px-4 py-2 text-xs gap-1.5",
      md: "px-6 py-2 text-[12px] gap-1.5",
      lg: "px-8 py-4 text-md gap-2.5",
      xl: "px-10 py-5 text-lg gap-3",
    }

    const iconSizes = {
      sm: "w-4 h-4",
      md: "w-4 h-4",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    }

    const router = useRouter()
    const gradientVariants = {
      primary: "bg-gradient-to-r from-[#B2D0F9] via-[#FFDB9A] via-[#F08878] to-[#FDC3B6]",
      secondary: "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400",
      premium: "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500",
      electric: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
    }

    const shadowVariants = {
      primary: "shadow-[0_4px_20px_rgba(178,208,249,0.3)] hover:shadow-[0_8px_30px_rgba(178,208,249,0.4)]",
      secondary: "shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]",
      premium: "shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.4)]",
      electric: "shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)]",
    }

    const IconComponent = {
      crown: Crown,
      sparkles: Sparkles,
      zap: Zap,
      star: Star,
      none: null,
    }[icon]

    return (
      <button
        onClick={() => router.push('/dashboard/billing')} // Assuming openPricingModal is defined elsewhere
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-semibold text-black transition-all duration-300 ease-out",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2s focus:ring-white/20",
          sizeClasses[size],
          gradientVariants[variant],
          shadowVariants[variant],
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        <div className="relative flex items-center gap-2">
          {IconComponent && <IconComponent className={iconSizes[size]} />}
          {children}
        </div>
      </button>
    )
  },
)

export default UpgradeButton