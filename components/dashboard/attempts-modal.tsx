"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useGetQuizAttempts } from "@/app/dashboard/hooks/useQuizAttempt";
import AttemptResults from "@/app/dashboard/practice/components/AttemptResults";
import { AttemptData } from "@/app/dashboard/practice/types";

export function AttemptsDialog({ attemptId }: { attemptId: string }) {
  const { quizAttemptsData, quizAttemptLoading, quizAttemptError } = useGetQuizAttempts({attemptId});

  if (quizAttemptLoading) {
    return <div>Loading...</div>;
  }

  if (quizAttemptError) {
    return <div>Error loading quiz attempt</div>;
  }

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
                <SquareArrowOutUpRight className="h-6 w-6 text-foreground hover:text-foreground/50 cursor-pointer" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Peformance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent  className="md:max-w-7xl max-h-[90vh] w-[98vw] overflow-y-auto md:px-6 rounded-3xl">
        {quizAttemptsData && (
          <AttemptResults attempt={quizAttemptsData as AttemptData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
