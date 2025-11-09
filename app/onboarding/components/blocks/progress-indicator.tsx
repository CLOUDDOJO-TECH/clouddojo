interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-500 ${
            index === currentStep
              ? "bg-emerald-500 shadow-lg shadow-emerald-500/50 w-6"
              : index < currentStep
                ? "bg-emerald-500 w-2"
                : "bg-gray-300 dark:bg-gray-600 w-2"
          }`}
        />
      ))}
    </div>
  );
}
