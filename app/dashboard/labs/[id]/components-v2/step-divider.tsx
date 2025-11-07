import { Separator } from "@/components/ui/separator";

interface StepDividerProps {
  stepNumber: number;
}

export function StepDivider({ stepNumber }: StepDividerProps) {
  return (
    <div className="relative flex items-center my-12">
      <Separator className="flex-1" />
      <span className="px-4 text-sm font-medium text-muted-foreground bg-background">
        Step {stepNumber}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}
