"use client"

import { Card } from "@/components/ui/card"
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { InfoIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

interface CategorySectionProps {
  categories: any[] // Replace with proper type
  isLoading: boolean
}

export default function CategoriesSection({ 
  categories, 
  isLoading 
}: CategorySectionProps) {
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }
  
  // Empty state - no categories
  if (!categories || categories.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <InfoIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No categories available</h3>
          <p className="text-muted-foreground max-w-md">
            Check back later for quiz categories.
          </p>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quiz Categories</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Categories of quizzes available for you to practice.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {category.questionCount} {category.questionCount === 1 ? 'question' : 'questions'}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href={`/quizzes?category=${category.id}`}>
                  <ArrowRightIcon className="h-4 w-4" />
                  <span className="sr-only">Explore {category.name}</span>
                </Link>
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-1">
          <Button variant="outline" size="sm" asChild>
            <Link href="/quizzes">
              View All Categories
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
} 