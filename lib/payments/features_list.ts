type VariantType = 'MONTHS' | 'YEARS';

const FEATURE_MAP: Record<string, Record<VariantType, string[]>> = {
  "Clouddojo Pro": {
    MONTHS: [
      "Unlimited phone calls",
      "30 second checks",
      "Single-user account",
      "20 monitors",
      "Up to 6 seats",
    ],
    YEARS: [
      "Everything in Pro Monthly",
      "Priority support",
      "Custom integrations",
      "Advanced reporting",
      "30 monitors",
    ],
  },
  "Clouddojo Premium": {
    MONTHS: [
      "Unlimited phone calls",
      "15 second checks",
      "Team dashboard",
      "50 monitors",
      "Up to 10 seats",
    ],
    YEARS: [
      "Everything in Premium Monthly",
      "Enterprise SSO",
      "Audit logs",
      "100 monitors",
      "Dedicated success manager",
    ],
  },
};
