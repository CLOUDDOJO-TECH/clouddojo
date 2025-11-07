import { Clock } from "lucide-react";

interface StatsRowSimpleProps {
  difficulty: string;
  estimatedTime: number;
  totalSteps: number;
}

// Custom icon component matching the Figma design
const StatsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function StatsRowSimple({
  difficulty,
  estimatedTime,
  totalSteps,
}: StatsRowSimpleProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const stats = [
    {
      label: "Difficulty",
      value: difficulty.charAt(0) + difficulty.slice(1).toLowerCase(),
    },
    {
      label: "Time",
      value: formatTime(estimatedTime),
    },
    {
      label: "Steps",
      value: totalSteps.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-4">
          {/* Icon Box */}
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0">
            <StatsIcon />
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-base font-medium">{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
