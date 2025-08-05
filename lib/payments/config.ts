import { fetchPlans } from "@/config/actions";
import { pricesFromJSON } from "@polar-sh/sdk/models/components/product.js";

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export interface PricingTier {
  name: string;
  id: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}


const mapFeatureList = (planName: string) => {
  const featureList = FEATURE_MAP[planName];
  if (!featureList) return [];
  return featureList[PAYMENT_FREQUENCIES.includes('yearly') ? 'YEARS' : 'MONTHS'];
}

export async function getTiers(): Promise<PricingTier[]> {

  const plans = await fetchPlans();
  
  return plans.map(plan => ({
    id: plan.id,
    name: plan.name,
    price: parseFloat(plan.price),
    description: plan.description || '',
    features: plan.features,
    cta: plan.team ? 'Contact Us' : 'Get started',
    highlighted: plan.name.includes('pro'),
    popular: !plan.name.includes("premium"),
  }));
}



export const TIERS: PricingTier[] = [
  {
    id: "clouddojo-pro",
    name: "Clouddojo Pro",
    price: 899,
    description: "Best for individuals",
    features: [
      "Everything included in the Pro Plan",
      "Advanced analytics",
      "AI-powered explanations",
      "Realistic mock interviews",
      "Personalized study roadmap",
      "Access to discord/whatsapp community",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "clouddojo-premium",
    name: "Clouddojo Premium",
    price: 9550,
    description: "Best for teams",
    features: [
      "Unlimited access to all practice tests",
      "Track your progress and identify weak areas",
      "Flashcard system to memorize key concepts faster",
      "Downloadable PDF reports to review anytime",
      "Fast-track your certification preparation",
    ],
    cta: "Get started",
    // popular: true,
  },
];