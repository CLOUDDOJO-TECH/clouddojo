// app/dashboard/billing/(components)/plans.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { NoPlans, Plan } from "./plan";
import { fetchPlans } from "@/config/actions"; // Import your server action

export function Plans({ 
  className = "",
  onSubscribeComplete 
}: { 
  className?: string,
  onSubscribeComplete?: () => void
}) {

  const { data: allPlans = [], isLoading, error } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      return fetchPlans();
    },
  });
  console.log("Plans data:", allPlans);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading plans</div>;
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

