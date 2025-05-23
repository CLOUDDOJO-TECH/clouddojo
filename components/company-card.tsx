"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompanyCardProps {
  name: string
  logo: string
  questionCount: number
  onClick?: () => void
  className?: string
}

export function CompanyCard({ name, logo, questionCount, onClick, className }: CompanyCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })

    // Add slight delay for blob movement
    setTimeout(() => {
      setBlobPosition({ x, y })
    }, 100)
  }

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-slate-900/50 border border-slate-800 p-5 transition-all duration-300",
        "hover:border-slate-700 hover:bg-slate-900/70 cursor-pointer",
        className,
      )}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Blob effect */}
      <div
        className="absolute pointer-events-none transition-all duration-300 rounded-full blur-3xl"
        style={{
          left: `${blobPosition.x - 75}px`,
          top: `${blobPosition.y - 75}px`,
          width: "150px",
          height: "150px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          opacity: isHovering ? 1 : 0,
          transform: `translate(0, 0)`,
          transition: `transform 0.1s ease-out, opacity 0.3s ease-in-out`,
        }}
      />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
            <Image src={logo || "/placeholder.svg"} alt={name} width={24} height={24} className="object-contain" />
          </div>
          <div>
            <h3 className="text-white text-lg font-medium">{name}</h3>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              <span className="inline-flex items-center justify-center w-5 h-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                  <path d="M17 7h.01" />
                  <path d="M7 17h.01" />
                  <path d="M17 17h.01" />
                </svg>
              </span>
              {questionCount} questions
            </p>
          </div>
        </div>
        <ArrowRight className="text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  )
}
