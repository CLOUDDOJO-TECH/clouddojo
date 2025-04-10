"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Clock,
  FileQuestion,
  Check,
  LayoutGrid,
  List,
} from "lucide-react"

import { practiceTests, categories, levels, type PracticeTest } from "@/public/data/test-data"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import FilterComponent from "@/components/dashboard/filter-component"
import SearchBar from "@/components/dashboard/search-bar"
import Link from "next/link"
import { GetPracticeTests } from "@/app/(actions)/quiz/get-quizes"
import prisma from "@/lib/prisma"
import { useQuery } from "@tanstack/react-query"
import { type DifficultyLevel, type Quiz } from "@prisma/client"
import { cn } from "@/lib/utils"
import PracticeTestsSkeleton from "./components/PracticeTestsSkeleton"
import UpgradeButton from "@/components/upgrade-button"

export default function PracticeTestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all")
  const [sortBy, setSortBy] = useState<"popularity" | "questions" | "newest">("popularity")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["practiceTests"],
    queryFn: async () => await GetPracticeTests()
  })

  const applyFilters = () => {
    setIsFilterOpen(false)
  }

  // Show skeleton UI during loading
  if (isLoading) {
    return <PracticeTestsSkeleton view={view} />
  }

  // Show error state
  if (isError) {
    return (
      <div className="container p-4 md:p-6 pt-16 md:pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading practice tests</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    )
  }

  // Return empty array if no data
  if (!data) return []
  const tests = data.data

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 container w-full">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-bold">Practice Tests</h1>
                
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
                <span className="flex space-x-3">
                <SearchBar />
                <FilterComponent />
                </span>
                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={(value) => value && setView(value as "grid" | "list")}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
            </div>


            <div className="mt-2">
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.map((test) => (
                    <TestCard key={test.id} test={test} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {tests.map((test) => (
                    <TestCard key={test.id} test={test} view="list" />
                  ))}
                </div>
              )}

              {tests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tests found</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TestCardProps {
  test: {
    id: string;
    title: string;
    description?: string | null;
    level?: DifficultyLevel | null;
    duration?: number | null;
    free?: boolean | null;
    _count?: {
      questions: number;
    }
    category?: {
      id: string;
      name: string;
    } | null;
  };
  view: "grid" | "list";
}

function TestCard({ test, view }: TestCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "advanced":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (view === "grid") {
    return (
      <Card className={`overflow-hidden transition-all hover:shadow-md `}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src="/aws-bg-image.jpg"
            alt={test.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          {test.free && (
            <Badge className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">Free</Badge>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className={`mb-2 ${getLevelColor(test.level!)}`}>
                {test.level!.charAt(0).toUpperCase() + test.level!.slice(1)}
              </Badge>
              <h3 className="font-semibold text-lg line-clamp-1">{test.title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{test.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
              <span>{test._count?.questions} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{test.duration} min</span>
            </div>
          </div>
        </CardContent>
        {
          test.free ?
          <CardFooter className="p-4 pt-0 w-full flex items-end justify-end">
            <Link 
              href={`/dashboard/practice/${test.id}`}
              className={buttonVariants({ 
                variant: "default", 
                size: "sm",
                className: "bg-green-600 hover:bg-green-700"
              })}
            >
              Start Test
            </Link>
          </CardFooter>
          :
          <CardFooter className="p-4 pt-0 flex w-full justify-end items-end">
            <UpgradeButton />
          </CardFooter>
        }
        
      </Card>
    )
  } else {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 lg:w-1/5 aspect-video md:aspect-square relative overflow-hidden">
            <img src="/aws-bg-image.jpg" className="object-cover w-full h-full transition-transform hover:scale-105"/>
            {test.free && (
              <Badge className="absolute top-2 right-2 bg-emerald-500 hover:bg-emerald-600">Free</Badge>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <div>
                {
                  test.level && (
                <Badge variant="outline" className={`mb-2 ${getLevelColor(test.level)}`}>
                  {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
                </Badge>

                  )
                }
                <h3 className="font-semibold text-lg">{test.title}</h3>
              </div>
           
                {test.free ? (
                  <Link 
                    href={`/dashboard/practice/${test.id}`}
                    className={buttonVariants({ 
                      variant: "default", 
                      size: "sm",
                      className: "bg-green-600 hover:bg-green-700"  
                    })}
                  >
                    Start Test
                  </Link>
                ) : (
                <UpgradeButton />
                )}
                </div>
            <p className="text-muted-foreground text-sm mb-3">{test.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                <span>{test._count?.questions} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{test.duration} min</span>
              </div>
              <Badge variant="outline" className="bg-background">
                {test.level}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

