"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { BackgroundBeams } from "../ui/background-beam"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const testimonials = [
    {
      name: "Eugene Wurah",
      role: "Network Engineer",
      company: "Growth Labs",
      content:
        "For someone who is a visual learner, reading those pdf dumps was boring. I needed something visually engaging and interactive. Enter Cloud Dojo. I owe passing my CCP to this platform.",
      rating: 5,
      avatar: "/testimonial/eugene.jpg",
    },
    {
      name: "Nicholas Ishimwe",
      role: "IT Specialist",
      company: "TechStart Inc.",
      content:
        "Clouddojo was very precise, it helped me understand the tweak around AWS, and also gave me insights towards the exam, the exam practices was so useful.. I think I got to be fully aware about the clouddojo through LinkedIn, and I am so grateful for that. I passed the exam with 90% and I am so happy about it.",
      rating: 5,
      avatar: "/testimonial/80.jpg",
    },
    {
        name: "Tracy Tenkorang",
        role: "Content Creator",
        company: "Digital Agency",
        content:
          "I love using Clouddojo, the fact that they simulate the real exam, so when you practice you're not just checking your knowledge but also working your speed and time keeping is really awesome. They've recent added the score board feature which I'm obsessed with, for someone who's competitive it's a very productive way to channel that part of me into my exam prep. Highly recommend for anyone preparing for their exam.",
        rating: 5,
        avatar: "/testimonial/tracy.jpg",
      },
    
    {
      name: "Emile Rodriguez",
      role: "Freelance Designer",
      company: "Creative Studio",
      content:
        "As a freelancer, this tool has been a game-changer. I can deliver high-quality work to my clients faster than ever before, and they're always impressed with the results.",
      rating: 5,
      avatar: "/testimonial/64.jpg",
    },
    {
      name: "David Thompson",
      role: "Product Manager",
      company: "Innovation Corp",
      content:
        "The website builder feature helped us launch our product landing page in just one day. No coding required, and it looks absolutely stunning on all devices.",
      rating: 5,
      avatar: "/testimonial/60.jpg",
    }
    
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-background w-full">
      {/* Gradient Blobs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute md:top-40 md:-right-40 top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute md:-bottom-40 md:-left-40 bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-400/20 via-cyan-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-foreground/50 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their workflow with our platform
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative mb-8">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-orange-600 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl md:text-2xl font-medium text-foreground font-serif mb-8 leading-relaxed max-w-4xl">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Avatar and Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                    <AvatarImage
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonials[currentIndex].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
                    <div className="text-sm text-primary font-medium">{testimonials[currentIndex].company}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="link"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="link"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-110"
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Grid */}
        <div className="md:grid grid-cols-2 md:grid-cols-5 gap-4 hidden">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                index === currentIndex
                  ? "ring-2 ring-primary shadow-lg scale-105"
                  : "hover:shadow-md opacity-70 hover:opacity-100"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage className="object-cover" src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm text-foreground">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-sm px-4 py-2 rounded-full transition-all duration-200 ${
              isAutoPlaying ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {isAutoPlaying ? "Auto-playing" : "Paused"} • Click to {isAutoPlaying ? "pause" : "resume"}
          </button>
        </div>
      </div>
        <BackgroundBeams />
    </section>
  )
}
