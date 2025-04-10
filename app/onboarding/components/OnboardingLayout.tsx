"use client"

import React from "react"
import OnboardingStepper from "./OnboardingStepper"
import Image from "next/image"
interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
}: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left sidebar with stepper */}
      
      <div className="hidden md:flex md:w-1/4 border-r p-6 lg:p-8 flex-col md:justify-center md:items-center">

      <div className="flex items-center space-x-2 m-3 mb-20">
        <Image src="/team-logo.webp" alt="Cloud Dojo" width={70} height={70} className="rounded-full" />
        <h1 className="text-2xl font-bold font-serif">Cloud Dojo</h1>
      </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Set up your account
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete these steps to get started
          </p>
        </div>
        
        <OnboardingStepper />
      </div>
      
      {/* Content area */}
      <div className="flex-1 flex flex-col md:w-3/4">
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl mx-auto">
            {/* Mobile stepper - only show progress bar */}
            <div className="mb-8 md:hidden">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold">
                  Step {currentStep} of {totalSteps}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Current step content */}
            <div className="bg-card border rounded-lg shadow-sm p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 