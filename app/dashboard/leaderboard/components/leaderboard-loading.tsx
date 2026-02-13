import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for the entire leaderboard page
 */
export function LeaderboardSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Podium skeleton */}
      <PodiumSkeleton />

      {/* Leaderboard table skeleton */}
      <LeaderboardTableSkeleton />
    </div>
  );
}

/**
 * Skeleton for the podium (top 3 users)
 */
export function PodiumSkeleton() {
  return (
    <div className="mb-14">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Second place - left */}
        <div className="sm:order-1 sm:translate-y-4">
          <PodiumCardSkeleton />
        </div>

        {/* First place - center (larger) */}
        <div className="sm:order-2 sm:col-span-1 sm:translate-y-0 sm:scale-110 sm:z-10">
          <PodiumCardSkeleton isWinner />
        </div>

        {/* Third place - right */}
        <div className="sm:order-3 sm:translate-y-4">
          <PodiumCardSkeleton />
        </div>
      </div>
    </div>
  );
}

/**
 * Individual podium card skeleton
 */
function PodiumCardSkeleton({ isWinner = false }: { isWinner?: boolean }) {
  return (
    <div className="relative">
      <div className="bg-sidebar rounded-xl border border-dashed p-5 h-full">
        <div>
          {/* User info with profile image */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton
                className={`${isWinner ? "h-16 w-16" : "h-14 w-14"} rounded-full`}
              />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Ranking score skeleton */}
          <div className="bg-muted/50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-2 gap-2">
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <StatCardSkeleton />
            <div className="col-span-2">
              <StatCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat card skeleton
 */
function StatCardSkeleton() {
  return (
    <div className="bg-muted/50 rounded-lg p-2 space-y-1">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

/**
 * Leaderboard table skeleton
 */
export function LeaderboardTableSkeleton() {
  return (
    <div className="mt-8">
      {/* Heading skeleton */}
      <Skeleton className="h-5 w-28 mb-4" />

      {/* Search bar skeleton */}
      <div className="mb-6 max-w-md">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-dashed overflow-hidden">
        {/* Table header */}
        <div className="border-b bg-muted/30 p-4">
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-3" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
            <Skeleton className="h-4 w-full col-span-2" />
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 7 }).map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual table row skeleton
 */
function TableRowSkeleton() {
  return (
    <div className="border-b p-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* User info */}
        <div className="flex items-center gap-3 col-span-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Stats */}
        <Skeleton className="h-4 w-auto col-span-2" />
        <Skeleton className="h-4 w-auto col-span-2" />
        <Skeleton className="h-4 w-auto col-span-2" />
      </div>
    </div>
  );
}
