"use client"

import { Sparkles, ArrowRight, Zap } from "lucide-react"
import UpgradeButton from "@/components/upgrade-button"
import { cn } from "@/lib/utils"

export default function UpgradeCard() {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
      
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 text-emerald-300/20">
        <Sparkles size={100} strokeWidth={0.5} />
      </div>
      <div className="absolute -left-6 -bottom-6 text-emerald-300/20">
        <Zap size={100} strokeWidth={0.5} />
      </div>
      
      {/* Content */}
      <div className="relative p-5 text-white z-10">
        <div className="flex items-start space-x-2 mb-3">
          <div className="rounded-full bg-white/20 p-1.5">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base">Go Premium</h3>
            <p className="text-xs text-emerald-50/80 mt-0.5 leading-tight">
              Access all tests and advanced features
            </p>
          </div>
        </div>
        
        {/* Features list */}
        <ul className="space-y-1.5 mb-4 text-xs">
          <li className="flex items-center">
            <ArrowRight size={10} className="mr-1.5 text-emerald-300" />
            <span>Unlimited practice exams</span>
          </li>
          <li className="flex items-center">
            <ArrowRight size={10} className="mr-1.5 text-emerald-300" />
            <span>AI-powered explanations</span>
          </li>
          <li className="flex items-center">
            <ArrowRight size={10} className="mr-1.5 text-emerald-300" />
            <span>Performance analytics</span>
          </li>
        </ul>
        
        <UpgradeButton 
          className={cn(
            "w-full bg-white hover:bg-emerald-50",
            "text-emerald-800 font-medium",
            "border border-white/10 shadow-sm",
            "transition-all duration-200 hover:shadow-md"
          )}
          label="Upgrade Now"
          size="sm"
          showIcon={true}
        />
      </div>
    </div>
  )
} 