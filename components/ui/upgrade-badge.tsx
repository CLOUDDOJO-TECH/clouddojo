import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface UpgradeBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UpgradeBadge({ className, size = "md" }: UpgradeBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  }

  return (
    <Badge
      className={`font-medium bg-gradient-to-r from-emerald-500 to-emerald-500/40 hover:from-emerald-600 hover:to-emerald-600/40 
      border-none text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 
      flex items-center gap-1 cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <Sparkles className={`${size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      Upgrade
    </Badge>
  )
}