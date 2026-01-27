import { Card } from "@/components/ui/card";
import * as React from "react";
import {
  IconWandSparkleFillDuo18,
  IconRefresh2FillDuo18,
  IconTargetFillDuo18,
  IconStopwatchFillDuo18,
  IconFileContentFillDuo18,
  IconProgressBarFillDuo18,
} from "@/components/landing/icons/feature-icons";

export default function ProvidersSection() {
  return (
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
              Everything You Need to Pass. Nothing You Don&apos;t.
            </h2>
            <p className="text-muted-foreground mt-6">
              No fluff, no filler — just the tools that actually move you from
              studying to certified.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="AI-Powered Practice Exams"
              description="Questions that mirror real AWS exams — generated and updated by AI so you're always practicing with current material."
              icon={<IconWandSparkleFillDuo18 />}
              color="#a78bfa"
            />

            <FeatureCard
              title="Real-Time Gap Analysis"
              description="Instantly see which AWS domains you're weak in. No more guessing what to study next — we show you exactly where to focus."
              icon={<IconRefresh2FillDuo18 />}
              color="#34d399"
            />

            <FeatureCard
              title="Exam Readiness Score"
              description="A single score that tells you whether you're ready to book your exam or need more practice. No ambiguity."
              icon={<IconTargetFillDuo18 />}
              color="#f87171"
            />

            <FeatureCard
              title="Timed Mock Exams"
              description="Simulate real exam conditions with timed tests. Build your pacing and confidence before the real thing."
              icon={<IconStopwatchFillDuo18 />}
              color="#fbbf24"
            />

            <FeatureCard
              title="Detailed Explanations"
              description="Every question comes with a clear breakdown of why each answer is right or wrong — so you actually learn, not just memorize."
              icon={<IconFileContentFillDuo18 />}
              color="#60a5fa"
            />

            <FeatureCard
              title="Progress Tracking"
              description="Track your improvement over time across every AWS domain. See your trajectory and know when you've peaked."
              icon={<IconProgressBarFillDuo18 />}
              color="#2dd4bf"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
  color,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}) => {
  return (
    <Card className="group relative overflow-hidden p-6">
      <div className="relative z-10">
        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      {icon && (
        <div
          className="feature-icon absolute -bottom-8 -right-8 rotate-[-15deg] transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-[-25deg]"
          style={{ "--icon-color": color } as React.CSSProperties}
        >
          {React.cloneElement(icon as React.ReactElement, {
            size: "150px",
            width: "150px",
            height: "150px",
          })}
        </div>
      )}
    </Card>
  );
};
