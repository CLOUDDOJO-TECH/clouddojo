import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function QuizSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-36" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-2 w-full mb-4" />

          <div className="flex flex-wrap gap-2 my-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded" />
            ))}
          </div>
        </CardContent>

        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
} 