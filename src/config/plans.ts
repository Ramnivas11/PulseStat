export type PlanKey = "free" | "pro";

export interface Plan {
  name: string;
  price: number;
  currency: "USD";
  description: string;
  eventLimit: number;
  websiteLimit: number;
  features: string[];
  interval: string;
}

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    name: "Free",
    price: 0,
    currency: "USD",
    description: "Start with basic analytics for one website.",
    eventLimit: 10000,
    websiteLimit: 1,
    features: [
      "10,000 events / month",
      "1 website",
      "Basic dashboard analytics",
      "Email support",
    ],
    interval: "Monthly",
  },

  pro: {
    name: "Pro",
    price: 9,
    currency: "USD",
    description: "Advanced analytics for growing businesses.",
    eventLimit: 1000000,
    websiteLimit: 100,
    features: [
      "1,000,000 events / month",
      "Up to 100 websites",
      "Realtime analytics",
      "Priority support",
    ],
    interval: "Monthly",
  },
};

export function getPlan(key: PlanKey) {
  return PLANS[key];
}
