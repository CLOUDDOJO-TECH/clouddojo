"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { toast } from "sonner"

interface PricingModalProps {
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function PricingModal({ trigger, isOpen, onOpenChange }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use either controlled state or internal state
  const open = isOpen !== undefined ? isOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const handleUpgrade = (tier: string) => {
    toast.success(`You selected the ${tier} plan. Redirecting to payment...`)
    // Todo: redirect to a payment page or process the upgrade
    setTimeout(() => setOpen(false), 2000)
  }

  // If no trigger is provided, just render the Dialog without a trigger
  const dialogContent = (
    <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
      <DialogHeader className="px-6 pt-6 pb-4 bg-primary/5 dark:bg-primary/10">
        <DialogTitle className="text-2xl font-bold">Upgrade Your Plan</DialogTitle>
        <DialogDescription>
          Unlock all features and take your AWS certification prep to the next level.
        </DialogDescription>
      </DialogHeader>
      
      <div className="p-6">
        <div className="flex justify-center mb-8">
          <Tabs 
            value={billingCycle} 
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
            className="w-[250px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="relative">
                Yearly
                <span className="absolute -top-3 -right-3 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  -20%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pro Plan */}
          <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col h-full">
              <div>
                <h3 className="text-lg font-bold">Pro</h3>
                <div className="mt-2 flex items-baseline text-gray-900 dark:text-gray-50">
                  <span className="text-3xl font-bold tracking-tight">
                    ${billingCycle === "monthly" ? "29" : "279"}
                  </span>
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for individual certification candidates
                </p>
              </div>
              
              <ul className="mt-6 space-y-3 flex-1">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>All practice tests</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Flashcard system</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>PDF reports</span>
                </li>
              </ul>
              
              <Button
                className="mt-6 w-full"
                onClick={() => handleUpgrade("Pro")}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
          
          {/* Premium Plan */}
          <div className="rounded-lg border border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 p-6 shadow-sm">
            <div className="flex flex-col h-full">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Premium</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    Recommended
                  </span>
                </div>
                <div className="mt-2 flex items-baseline text-gray-900 dark:text-gray-50">
                  <span className="text-3xl font-bold tracking-tight">
                    ${billingCycle === "monthly" ? "49" : "469"}
                  </span>
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  For serious professionals seeking deep mastery
                </p>
              </div>
              
              <ul className="mt-6 space-y-3 flex-1">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Question explanations with AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Mock interviews</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button
                className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => handleUpgrade("Premium")}
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          All plans come with a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </DialogContent>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {dialogContent}
    </Dialog>
  )
} 