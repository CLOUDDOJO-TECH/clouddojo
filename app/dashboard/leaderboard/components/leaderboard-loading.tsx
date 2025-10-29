import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading state for the entire leaderboard page
 */
export function LeaderboardSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
      <div className="rounded-xl border   p-5 h-full shadow-lg">
        {/* Crown decoration for winner */}
        {isWinner && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Skeleton className="h-10 w-10 rounded-full " />
          </div>
        )}

        <div className="relative z-10">
          {/* User info with profile image */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar skeleton */}
              <Skeleton
                className={`${isWinner ? "h-16 w-16" : "h-14 w-14"} rounded-full `}
              />
              <div className="space-y-2">
                {/* Name skeleton */}
                <Skeleton className="h-5 w-32 " />
                {/* Rank skeleton */}
                <Skeleton className="h-4 w-20 " />
              </div>
            </div>
            {/* Medal emoji skeleton */}
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
    <div className="bg-gray-200 dark:bg-muted rounded-lg p-2 space-y-1">
      <Skeleton className="h-3 w-12 bg-gray-300 dark:bg-muted" />
      <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-muted" />
    </div>
  );
}

/**
 * Leaderboard table skeleton
 */
export function LeaderboardTableSkeleton() {
  return (
    <div className="mt-8">
      {/* Search bar skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-md bg-gray-200 dark:bg-muted" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-white dark:bg-background overflow-hidden">
        {/* Table header */}
        <div className="border-b bg-gray-50 dark:bg-muted p-4">
          <div className="grid grid-cols-12 gap-4">
            <Skeleton className="h-4 w-full bg-gray-200 dark:bg-muted col-span-1" />
            {/*<Skeleton className="h-4 w-32 bg-gray-200 dark:bg-muted col-span-4" />
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-muted col-span-2" />
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-muted col-span-2" />
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-muted col-span-2" />
            <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-muted col-span-1" />*/}
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
    <div className="border-b p-4 hover:bg-gray-50 dark:hover:bg-muted">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Rank */}

        {/* User info */}
        <div className="flex items-center gap-3 col-span-4">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-200 dark:bg-muted" />
          <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-muted" />
        </div>

        {/* Stats */}
        <Skeleton className="h-4 w-auto bg-gray-200 dark:bg-muted col-span-2" />
        <Skeleton className="h-4 w-auto bg-gray-200 dark:bg-muted col-span-2" />
        <Skeleton className="h-4 w-auto bg-gray-200 dark:bg-muted col-span-2" />
      </div>
    </div>
  );
}
