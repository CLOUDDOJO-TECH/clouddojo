import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PracticeTestsSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex-1 container w-full">
        <div className="px-4 md:px-12 pt-6 md:pt-8">
          <div className="flex flex-col gap-4">
            {/* Header - single row matching new layout */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-9 w-44 mr-auto" />
              {/* Platform chip skeletons */}
              <Skeleton className="h-7 w-12 rounded-full" />
              <Skeleton className="h-7 w-14 rounded-full" />
              <Skeleton className="h-7 w-12 rounded-full" />
              {/* Sort & Filter button skeleton */}
              <Skeleton className="h-9 w-9 sm:w-32 rounded-md" />
              {/* Search icon skeleton */}
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>

            {/* Tests Grid */}
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
          </div>
        </div>
      </div>
    </div>
  )
}
