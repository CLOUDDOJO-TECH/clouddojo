"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plans } from "@/app/dashboard/billing/(components)/plans";
import { Suspense } from "react";

interface PricingModalProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PricingModal({
  trigger,
  isOpen,
  onOpenChange,
}: PricingModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleSubscribeComplete = () => {
    // Close the modal when subscription is complete
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="
          md:max-w-5xl w-full max-w-sm m-2 md:w-[95vw] p-0
          max-h-[95vh] md:max-h-[90vh] overflow-auto rounded-2xl shadow-2xl border
          bg-white dark:bg-zinc-900
        "
      >
        <DialogHeader
          className="
            px-4 md:px-8 pt-4 pb-6
            bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20
            rounded-t-2xl border-b
          "
        >
          <DialogTitle className="text-2xl md:text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2 text-zinc-600 dark:text-zinc-300">
            Level up your AWS certification prep with premium features and
            resources.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 md:p-8">
          <Suspense
            fallback={
              <div className="min-h-[50vh] w-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                  <p className="text-muted-foreground">Loading plans...</p>
                </div>
              </div>
            }
          >
            <Plans onSubscribeComplete={handleSubscribeComplete} />
          </Suspense>

          <div className="mt-8">
            <div className=" text-center space-y-4 text-xs">
              <p className="font-medium text-sm text-zinc-700 dark:text-zinc-200">
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
      </DialogContent>
    </Dialog>
  );
}
