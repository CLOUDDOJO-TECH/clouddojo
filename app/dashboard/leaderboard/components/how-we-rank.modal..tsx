"use client";

import { useState } from "react";
import { ArrowRightIcon, GlobeIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HowWeRank() {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Skill — 30%",
      description:
        "Your average score across all practice tests makes up 30% of your ranking. Consistently scoring well is the foundation of a strong position on the leaderboard.",
    },
    {
      title: "Dedication — 30%",
      description:
        "The more you practice, the higher you climb. Quiz volume counts for 30% of your ranking and scales logarithmically — every additional quiz helps, with no hard cap.",
    },
    {
      title: "Growth — 15%",
      description:
        "We track how your scores improve over time by comparing your recent performance to your earlier attempts. Showing progress is always rewarded, never penalized.",
    },
    {
      title: "Consistency — 10%",
      description:
        "Reliable, steady performance earns you points. The less your scores fluctuate between attempts, the higher your consistency score.",
    },
    {
      title: "Recent Activity — 15%",
      description:
        "Staying active matters. Users who have been practicing in the last two weeks get a boost over dormant accounts. Keep showing up to maintain your edge.",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-dashed"
              aria-label="Ranking system information"
            >
              <GlobeIcon className="h-7 w-7" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>How we rank!</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2">
          <img
            className="w-full rounded-md"
            src="/dialog-content.png"
            width={382}
            height={216}
            alt="dialog"
          />
        </div>
        <div className="space-y-6 px-6 pt-3 pb-6">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "size-1.5 rounded-full bg-primary",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group"
                  type="button"
                  onClick={handleContinue}
                >
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Okay</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
