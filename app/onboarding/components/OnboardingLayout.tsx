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
    <div className="flex min-h-screen bg-background w-full bg-white dark:bg-slate-950">
      {/* Left sidebar with stepper */}

      <div className="hidden w-80 flex-col border-r shadow-md dark:border-none border-gray-100 bg-gray-50 dark:bg-transparent p-6 lg:flex">

        <div className="mb-12 flex justify-center items-center space-x-2">
          <Image src="/images/dojo-logo.png" alt="Cloud Dojo" width={130} height={130} className="" />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold dark:text-emerald-700 text-emerald-900">Set up your account</h2>
          <p className="text-sm dark:text-white text-gray-500">Complete these steps to get started</p>
        </div>

        <OnboardingStepper />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col md:w-3/4 dark:bg-slate-950 bg-white">
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl mx-auto">
            {/* Mobile stepper - only show progress bar */}
            <div className="mb-8 md:hidden">
              <div className="flex items-center justify-center mb-2">

            <Image src="/images/dojo-logo.png" alt="Cloud Dojo" width={130} height={130} className="" />
            <h2 className="text-xl font-semibold text-emerald-600">Onboarding...</h2>

              </div>

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
            <div className="px-8 rounded-lg shadow-sm p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 