"use client";
import { PricingHeader } from "@/components/landing/pricing/PricingHeader";
import { Plans } from "./(components)/plans";
import { PAYMENT_FREQUENCIES } from "@/lib/payments/config";
import { useState } from "react";

export const PricingPage = () => {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState(
    PAYMENT_FREQUENCIES[0]
  );
  return (
    <div className="container font-main text-center md:max-w-7xl max-w-lg mx-auto p-6 md:p-14">
      <PricingHeader
        title="Plans and Pricing"
        subtitle="Get access to all our practice tests, courses, labs, and resources with a single subscription."
        frequencies={PAYMENT_FREQUENCIES}
        selectedFrequency={selectedPaymentFreq}
        onFrequencyChange={setSelectedPaymentFreq}
      />
      {/* Pricing tiers will be rendered here */}
      <Plans />
      <div className="mt-8">
        <div className=" text-center space-y-4 text-xs">
          <p className="font-medium font-main text-sm text-zinc-700 dark:text-zinc-200">
            All plans come with a{" "}
            <span className="font-bold text-primary">
              14-day money-back guarantee
            </span>
            . No questions asked.
          </p>
          <div className="flex items-center font-play justify-center gap-2 text-xs text-muted-foreground">
            🍋 Secure payment powered by Lemon Squeezy
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
