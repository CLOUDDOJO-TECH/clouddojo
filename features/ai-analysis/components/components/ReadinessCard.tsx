import { ReactNode } from 'react';

interface ReadinessCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  description: string;
}

export function ReadinessCard({ icon, title, value, description }: ReadinessCardProps) {
  return (
    <div className="bg-background/30 rounded-lg border border-foreground/10 p-4 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="font-medium text-foreground text-sm px-2">{title}</div>
      {/* <div className="text-sm font-bold text-foreground my-1 ">{value}</div> */}
      <div className="text-xs  mt-2 text-foreground/60">{description}</div>
    </div>
  );
} 