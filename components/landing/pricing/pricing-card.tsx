"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { PricingTier } from "../../../lib/payments/config";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { SignupButton } from "@/app/dashboard/billing/(components)/subscribe";
import Link from "next/link";

export const PricingCard = ({
  tier,
  // paymentFrequency,
}: {
  tier: PricingTier;
  // paymentFrequency: string;
}) => {
  // const price = tier.price[paymentFrequency as keyof typeof tier.price];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;
  const price = parseFloat((tier.price / 100).toFixed(2)); // Assuming price is in cents, convert to dollars

  const { isSignedIn } = useAuth();
  return (
    <div
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow ",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
        isPopular && "outline outline-[rgba(120,119,198)]",
      )}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        {isHighlighted && <HighlightedBackground />}*
        {isPopular && <PopularBackground />}
      </div>

      {/* Card Content Container - all content positioned above backgrounds */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* Card Header */}
        <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
          {tier.name}
          {isPopular && (
            <Badge className="mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900">
              🔥 Most Popular
            </Badge>
          )}
        </h2>

        {/* Price Section */}
        <div className="relative h-12">
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              value={price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs font-medium">Per month/user</p>
          </>
        </div>

        {/* Features */}
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium">{tier.description}</h3>
          <ul className="space-y-2">
            {tier.features.map((feature, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  isHighlighted ? "text-background" : "text-foreground/60",
                )}
              >
                <BadgeCheck strokeWidth={1} size={16} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action Button */}
        {isSignedIn ? (
          <SignInButton forceRedirectUrl="/dashboard/billing">
            <Button
              variant="expandIcon"
              Icon={ArrowRight}
              iconPlacement="right"
              className={cn(
                "h-fit w-full rounded-lg",
                isHighlighted && "bg-accent text-foreground hover:bg-accent/95",
              )}
            >
              {tier.cta}
            </Button>
          </SignInButton>
        ) : (
          <Link href={"/dashboard/billing"}>
            <Button
              variant="expandIcon"
              Icon={ArrowRight}
              className={cn(
                "h-fit w-full rounded-lg",
                isHighlighted && "bg-accent text-foreground hover:bg-accent/95",
              )}
            >
              {tier.cta}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

// Highlighted Background Component
const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] opacity-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:opacity-30" />
);

// Popular Background Component
const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
);
