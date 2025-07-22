import { cn } from "@/lib/utils"
import { CrownIcon } from "lucide-react"
import { forwardRef } from "react"

interface UpgradeBadgeProps {
  size?: "sm" | "md"
  variant?: "primary" | "secondary" | "premium"
  children: React.ReactNode
  className?: string
}

const UpgradeBadge = forwardRef<HTMLSpanElement, UpgradeBadgeProps>(
  ({ className, size = "sm", variant = "primary", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
    }

    const gradientVariants = {
      primary: "bg-gradient-to-r from-[#B2D0F9] via-[#FFDB9A] via-[#F08878] to-[#FDC3B6]",
      secondary: "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400",
      premium: "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 justify-center rounded-full font-medium text-black",
          "shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.4)]",
          sizeClasses[size],
          gradientVariants[variant],
          className,
        )}
        {...props}
      >
        <CrownIcon className='w-3 h-4' />
        {children}
      </span>
    )
  },
)

UpgradeBadge.displayName = "UpgradeBadge"
export default UpgradeBadge