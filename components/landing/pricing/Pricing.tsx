"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PAYMENT_FREQUENCIES, getTiers, TIERS as StaticTier, PricingTier} from "../../../lib/payments/config";
import { PricingHeader } from "./PricingHeader";
import { PricingCard } from "./pricing-card";
import { useAuth } from "@clerk/nextjs";

export const Pricing = () => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    PAYMENT_FREQUENCIES[0],
  );

  const [ tiers, setTiers ] = useState<PricingTier[]>(StaticTier);

  const { userId, isSignedIn } = useAuth();

  if (isSignedIn && userId) {
    const { data: tiers = [], isLoading, error } = useQuery({
      queryKey: ["pricing-tiers"],
      queryFn: getTiers,
    });

    if (error) {
      return (
        <section className="flex flex-col items-center gap-10 py-10">
          <div className="text-red-500">Error loading pricing plans. Please try again later.</div>
        </section>
      );
    }

    setTiers(tiers);
  }

  const LoadingPlans = () => {
    return (
      <section className="flex flex-col items-center gap-10 py-10">
        <div className="w-full max-w-6xl animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-8"></div>
          <div className="grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

 
  return (
    <section className="flex flex-col items-center gap-10 py-10">
      {/* Section Header */}
      <PricingHeader
        title="Plans and Pricing"
        subtitle="Get access to all our practice tests, courses, labs, and resources with a single subscription."
        frequencies={PAYMENT_FREQUENCIES}
        selectedFrequency={selectedPaymentFreq}
        onFrequencyChange={setSelectedPaymentFreq}
      />


      {/* Pricing Cards */}

        <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier, i) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            // paymentFrequency={selectedPaymentFreq}
          />
        ))}
      </div>
      
    </section>
  );
};