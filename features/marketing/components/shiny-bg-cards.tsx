"use client"

import type React from "react"

import { useState, useEffect, useRef, type MouseEvent } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface IconProps {
  src?: string
  alt?: string
  icon?: React.ReactNode
  label?: string
}

export interface BlobEffectProps {
  enabled?: boolean
  size?: number
  opacity?: number
  delay?: number
  color?: string
}

export interface ShinyBlackCardProps {
  title: string
  description: string
  icons: IconProps[]
  className?: string
  onClick?: () => void
  blobEffect?: BlobEffectProps
}

export const ShinyBlackCard = ({
  title,
  description,
  icons = [],
  className,
  onClick,
  blobEffect = {
    enabled: true,
    size: 150,
    opacity: 0.07,
    delay: 0.1,
    color: "255, 255, 255",
  },
}: ShinyBlackCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement inside the card
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !blobEffect.enabled) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  // Update blob position with delay
  useEffect(() => {
    if (!isHovering || !blobEffect.enabled) return

    const timeout = setTimeout(
      () => {
        setBlobPosition(mousePosition)
      },
      blobEffect.delay ? blobEffect.delay * 1000 : 100,
    )

    return () => clearTimeout(timeout)
  }, [mousePosition, isHovering, blobEffect.delay, blobEffect.enabled])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-950 p-6 transition-all duration-300",
        "border border-slate-900 shadow-lg hover:shadow-xl hover:border-slate-800",
        "backdrop-blur-sm backdrop-filter",
        className,
      )}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Blob effect */}
      {blobEffect.enabled && (
        <div
          className="absolute pointer-events-none transition-all duration-300 rounded-full blur-3xl"
          style={{
            left: `${blobPosition.x - (blobEffect.size || 150) / 2}px`,
            top: `${blobPosition.y - (blobEffect.size || 150) / 2}px`,
            width: `${blobEffect.size || 150}px`,
            height: `${blobEffect.size || 150}px`,
            backgroundColor: `rgba(${blobEffect.color || "255, 255, 255"}, ${blobEffect.opacity || 0.00})`,
            opacity: isHovering ? 1 : 0,
            transform: `translate(0, 0)`,
            transition: `transform ${blobEffect.delay || 0.1}s ease-out, opacity 0.3s ease-in-out`,
          }}
        />
      )}

      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Icons row */}
        <div className="flex flex-wrap gap-4 mb-auto">
          {icons.map((icon, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black/80 border border-zinc-800 shadow-inner overflow-hidden group-hover:border-zinc-700 transition-all duration-300"
            >
              {icon.src ? (
                <Image
                  src={icon.src || "/placeholder.svg"}
                  alt={icon.alt || "Icon"}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              ) : icon.icon ? (
                icon.icon
              ) : null}
              {icon.label && <span className="text-white font-medium text-sm">{icon.label}</span>}
            </div>
          ))}
        </div>

        {/* Text content */}
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}
