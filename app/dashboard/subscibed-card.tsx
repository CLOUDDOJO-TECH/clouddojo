import { Check, Info, Sparkles, Crown, Zap, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type PlanType = "free" | "pro" | "business" | "enterprise"

interface SubscriptionCardProps {
  plan: string
  variant?: "minimal" | "gradient" | "outlined" | "glass" | "accent"
  className?: string
}

export default function SubscriptionCard({ plan, variant = "minimal", className }: SubscriptionCardProps) {


  return (
    <TooltipProvider>
      <Card
        className={cn(
          "overflow-hidden",
          variant === "minimal" && "border border-emerald-200 bg-white shadow-sm",
          variant === "gradient" && "border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-md",
          variant === "outlined" && "border-2 border-emerald-500 bg-sidebar shadow-sm",
          variant === "glass" && "border border-white/20 bg-emerald-100/20 backdrop-blur-md shadow-lg",
          variant === "accent" && "border-0 bg-emerald-500 text-foreground shadow-md",
          className,
        )}
      >
        <CardContent className="px-3 py-2">
          <div className="">
            <div className="flex flex-col">
              <div className="flex justify-between w-full items-center gap-1.5">
                <h3 className={cn("font-medium", variant === "accent" ? "text-white" : "text-foreground font-mono")}>{plan}</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      className={cn(
                        "h-5 w-5 cursor-pointer",
                        variant === "accent" ? "text-white/70" : "text-primary",
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-emerald-800">
                    Perfect Plan for proffessionals
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className={cn("text-xs mt-0.5", variant === "accent" ? "text-white/80" : "text-foreground/70")}>
                You have access to all features
              </p>
            </div>
            {/* <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                variant === "minimal" && "bg-emerald-100 text-emerald-600",
                variant === "gradient" && "bg-emerald-500 text-white",
                variant === "outlined" && "bg-white text-emerald-500 border border-emerald-500",
                variant === "glass" && "bg-emerald-500/20 text-emerald-600",
                variant === "accent" && "bg-white text-emerald-500",
              )}
            >
              <Sparkles className="h-4 w-4" />
            </div> */}
          </div>

          {variant !== "minimal" && (
            <div className="mt-3 flex items-center">
              <Badge
                variant={variant === "accent" ? "outline" : "default"}
                className={cn("text-xs font-normal bg-gradient-to-b from-emerald-500 to-primary shadow-md", variant === "accent" && "border-white/30 text-white")}
              >
                <Check className="mr-1 h-3 w-3" /> Active
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
