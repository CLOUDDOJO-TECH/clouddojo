import { Skeleton } from "@/components/ui/skeleton";

export const QuizAttemptsSkeleton = () => {
  return (
    <div className="rounded-lg  bg-gray-200/10 p-14 md:p-16">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon Circle */}
        <Skeleton className="h-16 w-16 rounded-full bg-gray-200 dark:bg-muted" />

        {/* Title */}
        <Skeleton className="h-7 w-48 bg-gray-200/60 dark:bg-muted" />

        {/* Description */}
        <div className="space-y-2 w-full max-w-md">
          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-muted" />
          <Skeleton className="h-4 w-5/6 mx-auto bg-gray-200 dark:bg-muted" />
        </div>
      </div>
    </div>
  );
};

export const RecentActivitySkeleton = () => {
  return (
    <div className="rounded-lg  bg-gray-200/10 p-14 md:p-16">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon Circle */}
        <Skeleton className="h-16 w-16 rounded-full bg-gray-200 dark:bg-muted" />

        {/* Title */}
        <Skeleton className="h-7 w-48 bg-gray-200/60 dark:bg-muted" />

        {/* Description */}
        <div className="space-y-2 w-full max-w-md">
          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-muted" />
          <Skeleton className="h-4 w-5/6 mx-auto bg-gray-200 dark:bg-muted" />
        </div>
      </div>
    </div>
  );
};
