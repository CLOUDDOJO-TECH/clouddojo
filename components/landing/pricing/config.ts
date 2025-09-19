export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export interface PricingTier {
  name: string;
  id: string;
  price: Record<string, number | string>;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  popular?: boolean;
}

export const TIERS: PricingTier[] = [
  {
    id: "individuals",
    name: "Individuals",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Starter pack for new users",
    features: [
      "200+ practice tests",
      "Community support",
      "Clouddojo AI Chatbot",
      "Weekly newsletter",
      "Flashcards",
    ],
    cta: "Get started",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 8.99,
      yearly: 90,
    },
    description: "For Serious Cloud Engineers",
    features: [
      "All practice tests",
      "Clouddojo AI Coach",
      "PremiumFlashcard",
      "Downloadable PDF reports",
      "AI Chatbot",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    id: "Gold",
    name: "Gold",
    price: {
      monthly: 14.99,
      yearly: 180,
    },
    description: "Great for large businesses",
    features: [
      "Custom",
      "Shareable Lab Reports",
      "Custom Roadmaps",
      "Live Exercises",
      "Cloud Job opportunities",
    ],
    cta: "Get started",
  },
  // {
  //   id: "enterprise",
  //   name: "Enterprise",
  //   price: {
  //     monthly: "Custom",
  //     yearly: "Custom",
  //   },
  //   description: "For multiple teams",
  //   features: [
  //     "Up to 5 team members",
  //     "100 monitors",
  //     "15 status pages",
  //     "200+ integrations",
  //   ],
  //   cta: "Contact Us",
  //   highlighted: true,
  // },
];
