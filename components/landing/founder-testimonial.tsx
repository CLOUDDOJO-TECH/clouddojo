"use client"

import type React from "react"

import Image from "next/image"
import { Linkedin } from "lucide-react"
import { useState } from "react"
import { FaLinkedin } from "react-icons/fa6"

export interface FounderTestimonialProps {
  className?: string
}

export function FounderTestimonial({ className = "" }: FounderTestimonialProps) {
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
    <section className={`py-16 md:py-24 ${className} px-4`}>
      {/* Main Heading */}
      <div className="text-center mb-16">
        <h2 className="text-foreground/80 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-5xl mx-auto">
        We're building CloudDojo with clarity, intelligence, and purpose.
        </h2>
      </div>

      {/* Testimonial Card */}
      <div className="max-w-4xl mx-auto">
        <div
          className="relative group overflow-hidden rounded-2xl bg-black/70 dark:bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 transition-all duration-300 hover:border-zinc-700"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Blob effect */}
          <div
            className="absolute pointer-events-none transition-all duration-300 rounded-full blur-3xl"
            style={{
              left: `${blobPosition.x - 100}px`,
              top: `${blobPosition.y - 100}px`,
              width: "200px",
              height: "200px",
              backgroundColor: "rgba(52, 211, 153, 0.3)",
              opacity: isHovering ? 10 : 0,
              transform: `translate(0, 0)`,
              transition: `transform 0.1s ease-out, opacity 0.3s ease-in-out`,
            }}
          />

          <div className="relative z-10">
            {/* Quote */}
            <blockquote className="text-white font-serif font-extralight text-lg md:text-xl leading-relaxed mb-8">
              "Throughout my journey studying and working in the cloud industry, I noticed how overwhelming it can be to prepare for certifications like AWS, Azure, or GCP — especially without tailored guidance. Many learners waste time jumping between outdated resources, generic courses, and practice tests that don’t adapt to their needs.
              <br />
              <br />
              CloudDojo is the result of my passion for simplifying that journey. By combining AI with structured practice and smart insights, we help aspiring cloud engineers focus on what actually matters — learning effectively and passing with confidence."
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white text-xl font-semibold">Bonyu Glen M.</h3>
                  <FaLinkedin className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-zinc-400 text-base font-mono mb-1">Founder, CEO of Clouddojo</p>
                <p className="text-brand-beige-700 font-mono text-sm">Ex-Staff Engineer, LADX</p>
              </div>

              {/* Profile Image */}
              <div className="ml-6 flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-zinc-700">
                  <Image
                    src="/images/founder-me.jpg"
                    alt="Glen Miracle"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
