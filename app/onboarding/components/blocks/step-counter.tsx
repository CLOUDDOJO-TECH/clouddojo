interface StepCounterProps {
  currentStep: number;
  totalSteps: number;
}

export function StepCounter({ currentStep, totalSteps }: StepCounterProps) {
  return (
    <div className="text-center mt-6">
      <span className="text-xs text-gray-500 dark:text-gray-500">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
