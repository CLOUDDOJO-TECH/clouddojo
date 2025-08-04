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
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            index < currentStep
              ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
              : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}
