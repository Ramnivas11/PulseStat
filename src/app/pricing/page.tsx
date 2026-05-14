import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/config/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComingSoonDialog } from "@/features/billing/components/coming-soon-dialog";

export const metadata = {
  title: "Pricing - PulseStat",
  description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
  keywords: "analytics pricing, website analytics plans, real-time analytics subscription",
  openGraph: {
    title: "Pricing - PulseStat",
    description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
    url: "https://pulse-stat.ramnivas.in/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - PulseStat",
    description: "Choose the perfect plan for your analytics needs. Start free, upgrade as you grow.",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={`relative ${key === 'pro' ? 'border-primary shadow-lg' : ''}`}>
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval.toLowerCase()}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  {key === 'free' ? (
                    <Link href="/signup">
                      <Button variant="outline" size="lg" className="w-full">
                        Get Started Free
                      </Button>
                    </Link>
                  ) : (
                    <ComingSoonDialog triggerLabel="Join waitlist" />
                  )}
                </div>
                {key === 'pro' && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Pro subscriptions are launching soon. Join the waitlist to receive launch updates.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include SSL encryption, real-time analytics, and priority support.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}