"use client"

import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown'

interface PricingModalProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function PricingModal({ trigger, isOpen, onOpenChange }: PricingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const { data: pricingPlans, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      return response.json()
    }
  })

  const handleUpgrade = (productId: string) => {
    if (!productId) return
    
    toast.loading("Redirecting to checkout...")
    
    // Directly navigate to the checkout route
    // This will trigger the route.ts handler which creates and redirects to the Polar checkout
    window.location.href = `/checkout?products=${productId}`
    toast.success("Preparing checkout...")

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="md:max-w-2xl w-[90vw] p-0 h-[90vh] overflow-auto rounded-2xl shadow-xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-primary/5 dark:bg-primary/10 rounded-t-2xl">
          <DialogTitle className="text-3xl font-bold text-center">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="text-center">
            Unlock all features and level up your AWS certification prep.
        </DialogDescription>
      </DialogHeader>
      
        <div className="p-8">
        {isLoading ? (
            <div className="flex justify-center p-10 animate-pulse text-muted-foreground">
              Loading plans...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 p-4">
            Failed to load pricing plans
            <Button 
              className="mt-2 mx-auto block" 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pricingPlans?.items.map((product) => {
                const isPremium = product.name.toLowerCase().includes("premium")

                return (
              <div
                key={product.id}
                    className={`flex flex-col justify-between p-10 rounded-2xl border shadow-lg transition-all ${
                      isPremium
                        ? "bg-emerald-50 ring-2 ring-emerald-400 scale-105"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-y-6">
                  <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-extrabold">{product.name}</h3>
                        {isPremium && (
                          <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="text-muted-foreground text-sm prose max-w-none">
                        <ReactMarkdown>{product.description}</ReactMarkdown>
                      </div>

                      <div className="space-y-3 text-gray-700 text-sm">
                        {product.benefits.map((benefit) => (
                          <div key={benefit.id} className="flex items-center gap-2">
                            <CheckIcon className="h-5 w-5 text-green-500" />
                            <span>{benefit.description}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                    <div className="mt-8 flex flex-col items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-extrabold ${
                          isPremium ? "text-emerald-600" : "text-gray-800"
                        }`}>
                      {product.prices[0].amountType === "fixed"
                        ? `$${product.prices[0].priceAmount / 100}`
                        : product.prices[0].amountType === "free"
                          ? "Free"
                          : "Pay what you want"}
                    </span>
                    {product.prices[0].amountType === "fixed" && (
                          <span className="text-sm text-muted-foreground">
                            /month
                      </span>
                    )}
                      </div>

                <Button
                        variant={isPremium ? "default" : "outline"}
                        className={`w-full py-6 text-lg font-bold ${
                          isPremium ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
                  }`}
                  onClick={() => handleUpgrade(product.id)}
                >
                  Upgrade
                </Button>
              </div>
                  </div>
                )
              })}
          </div>
        )}
        
          <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans come with a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </DialogContent>
    </Dialog>
  )
} 
