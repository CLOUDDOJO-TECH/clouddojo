import { SearchXIcon, CheckCircle2, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { LsSubscriptionPlan } from "@prisma/client";
import { Section } from "./section";
import { SignupButton } from "./subscribe";
import { Badge } from "@/components/ui/badge";

export function Plan({
  plan,
  currentPlan = null,
  isChangingPlans = false,
  isPopular = false,
  onSubscribeComplete,
}: {
  plan: LsSubscriptionPlan;
  currentPlan?: LsSubscriptionPlan | null;
  isChangingPlans?: boolean;
  isPopular?: boolean;
  onSubscribeComplete?: () => void;
}) {
  const { id, productName, interval, name, price } = plan;
  const isCurrent = id && currentPlan?.id === id;

  // Predefined features based on plan type
  const getFeatures = () => {
    if (
      productName?.toLowerCase().includes("pro") &&
      name?.toLowerCase().includes("premium")
    ) {
      return [
        "Everything included in the Pro Plan",
        "Advanced analytics",
        "AI-powered explanations",
        "Realistic mock interviews",
        "Personalized study roadmap",
        "Access to discord/whatsapp community",
      ];
    } else if (productName?.toLowerCase().includes("pro")) {
      return [
        "Unlimited access to all practice tests",
        "Track your progress and identify weak areas",
        "Flashcard system to memorize key concepts faster",
        "Downloadable PDF reports to review anytime",
        "Fast-track your certification preparation",
      ];
    }
    return [];
  };

  const features = getFeatures();

  return (
    <Section
      className={cn(
        "not-prose font-main p-6 rounded-2xl max-w-sm shadow-md border border-surface-100 bg-white dark:bg-zinc-900 relative overflow-hidden",
        // isCurrent && "border-emerald-400",
        isPopular && "outline outline-[rgba(120,119,198)]",
      )}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0">
        {/*{isHighlighted && <HighlightedBackground />}**/}
        {isPopular && <PopularBackground />}
      </div>

      <Section.Item className="flex-col items-start gap-4 z-10">
        <header className="flex w-full flex-col items-start mb-4">
          {name ? (
            <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
              {name}
              {isPopular && (
                <Badge className="mt-1 bg-orange-900 px-1 py-0 text-white hover:bg-orange-900">
                  🔥 Most Popular
                </Badge>
              )}
            </h2>
          ) : null}

          <div className="mt-6 mb-2 text-3xl font-bold text-brand-beige-900 dark:text-brand-beige-100">
            {formatPrice(price)}
            <span className="text-base font-normal text-zinc-500 ml-1">
              {!plan.isUsageBased && interval ? `per ${interval}` : null}
              {plan.isUsageBased && interval ? `/unit per ${interval}` : null}
            </span>
          </div>
        </header>

        {/* {features.length > 0 && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-emerald-600">🔥 Everything you need to pass your AWS exam</span>
          </div>
        )} */}

        {features.length > 0 ? (
          <ul className="mb-6 space-y-3 w-full">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex  text-start items-start gap-2 text-zinc-700 dark:text-zinc-200"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Section.Item>

      <SignupButton
        className={cn(
          "w-full mt-4 z-10",
          isPopular ? "bg-emerald-600 hover:bg-emerald-700" : "",
        )}
        plan={plan}
        isChangingPlans={isChangingPlans}
        currentPlan={currentPlan}
        onComplete={onSubscribeComplete}
      />
    </Section>
  );
}

export function NoPlans() {
  return (
    <section className="prose mt-[10vw] flex flex-col items-center justify-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-wg-red-50/70">
        <SearchXIcon
          className="text-wg-red"
          aria-hidden="true"
          size={48}
          strokeWidth={0.75}
        />
      </span>

      <p className="max-w-prose text-balance text-center leading-6 text-gray-500">
        There are no plans available at the moment.
      </p>
    </section>
  );
}

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] opacity-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:opacity-30" />
);

// Popular Background Component
const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
);
