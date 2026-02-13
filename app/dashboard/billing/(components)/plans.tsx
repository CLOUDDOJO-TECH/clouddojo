// app/dashboard/billing/(components)/plans.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { NoPlans, Plan } from "./plan";
import { fetchPlans } from "@/config/actions";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export function Plans({
  className = "",
  onSubscribeComplete
}: {
  className?: string,
  onSubscribeComplete?: () => void
}) {

  const { data: allPlans = [], isLoading, error, refetch } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      return fetchPlans();
    },
    retry: 2,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div className="flex flex-col items-center gap-3 py-6">
      <p className="text-muted-foreground">Failed to load plans</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
  if (!allPlans.length) return <NoPlans />;

  const sortedPlans = allPlans.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  return (
    <div className={`flex w-full mx-auto flex-col gap-4 justify-center items-center ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {sortedPlans.map((plan, index) => {
          const isPremium = plan.name?.toLowerCase().includes("gold") 
          return (
            <div
              key={`plan-${index}`}
              className="relative"
            >
              <Plan 
                plan={plan} 
                isPopular={!isPremium} 
                onSubscribeComplete={onSubscribeComplete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

