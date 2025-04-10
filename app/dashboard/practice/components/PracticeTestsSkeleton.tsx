import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LayoutGrid, List } from "lucide-react"

interface PracticeTestsSkeletonProps {
  view: "grid" | "list"
}

export default function PracticeTestsSkeleton({ view }: PracticeTestsSkeletonProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 container w-full">
        <div className="p-4 md:p-6 pt-16 md:pt-6">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <ToggleGroup
                  type="single"
                  value={view}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 w-full md:w-80" />
                <Skeleton className="h-10 w-full md:w-44" />
              </div>
            </div>

            {/* Tests List */}
            <div className="mt-2">
              <Skeleton className="h-6 w-48 mb-4" />

              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="aspect-video w-full" />
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-6 w-[80%]" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <Skeleton className="h-4 w-full mb-3" />
                        <Skeleton className="h-4 w-[90%] mb-3" />
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Skeleton className="h-9 w-24" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <Skeleton className="w-full md:w-48 h-32" />
                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-6 w-[80%]" />
                              <Skeleton className="h-4 w-full md:w-[90%]" />
                            </div>
                            <div className="mt-4 md:mt-0">
                              <Skeleton className="h-9 w-24" />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 