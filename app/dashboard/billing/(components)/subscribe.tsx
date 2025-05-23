"use client";

import { buttonVariants } from "@/components/ui/button";
import { changePlan, getCheckoutURL } from "@/config/actions";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Button, Loading } from "@lemonsqueezy/wedges";
import { LsSubscriptionPlan } from "@prisma/client";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  forwardRef,
  useState,
  type ComponentProps,
  type ElementRef,
} from "react";
import { toast } from "sonner";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
  embed?: boolean;
  isChangingPlans?: boolean;
  currentPlan?: LsSubscriptionPlan | null;
  plan: LsSubscriptionPlan;
  onComplete?: () => void; // Added callback for when process completes
};

export const SignupButton = forwardRef<ButtonElement, ButtonProps>(
  
  
  (props, ref) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
      embed = true,
      plan,
      currentPlan,
      isChangingPlans = false,
      onComplete,
      ...otherProps
    } = props;

    const isCurrent = currentPlan && plan.id === currentPlan.id;

    // eslint-disable-next-line no-nested-ternary -- allow
    const label = isCurrent
      ? "Your plan"
      : isChangingPlans
        ? "Switch to this plan"
        : "Subscribe";

    // eslint-disable-next-line no-nested-ternary -- disabled
    const before = loading ? (
      <Loading size="sm" className="size-4 dark" color="secondary" />
    ) : (props.before ?? isCurrent) ? (
      <CheckIcon className="size-4" />
    ) : (
      <PlusIcon className="size-4" />
    );

    const { isLoaded, isSignedIn } = useAuth();

    // If the user is not signed in, show a toast and return null
    // if (!isLoaded || !isSignedIn) {
    //   toast("Please sign in to subscribe.");
    // }

    return (
      <Button
        // class="lemonsqueezy-button"
        ref={ref}
        className="flex bg-orange-500"
        // before={before}
        disabled={(loading || isCurrent) ?? props.disabled}
        onClick={async () => {
          // If changing plans, call server action.
          if (isChangingPlans) {
            if (!currentPlan?.id) {
              throw new Error("Current plan not found.");
            }

            if (!plan.id) {
              throw new Error("New plan not found.");
            }

            setLoading(true);
            await changePlan(currentPlan.id, plan.id);
            setLoading(false);
            onComplete?.(); // Call onComplete when done
            return;
          }

          // Otherwise, create a checkout and open the Lemon.js modal.
          let checkoutUrl: string | undefined = "";
          try {
            setLoading(true);
            if (!isLoaded || !isSignedIn) {
              toast("Please sign in to subscribe.");
            }
            checkoutUrl = await getCheckoutURL(plan.variantId, embed);
          } catch (error) {
            setLoading(false);
            toast("Error creating a checkout.", {
              description:
                "Please check the server console for more information.",
            });
          } finally {
            embed && setLoading(false);
            onComplete?.(); // Call onComplete when done
          }

          embed
            // @ts-expect-error - LemonSqueezy is loaded via script tag
            ? checkoutUrl && window.LemonSqueezy.Url.Open(checkoutUrl)
            : router.push(checkoutUrl ?? "/");
        }}
        {...otherProps}
      >
        {loading ? "loading" : label}
      </Button>
    );
  },
);