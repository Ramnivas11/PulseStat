import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getCurrentSubscription } from "@/features/billing/services/billing.service";
import { PLANS, type PlanKey } from "@/config/plans";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { UsageOverview } from "@/features/billing/components/usage-overview";
import { ComingSoonSection } from "@/features/billing/components/coming-soon-section";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await getCurrentSubscription(
    session.user.id
  );
  
  // Need to account for expired subscriptions
  const isProActive =
    subscription?.plan === "pro" && 
    subscription?.status === "active" && 
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd >= new Date());

  const currentPlan: PlanKey = isProActive ? "pro" : "free";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Choose a plan, upgrade your account, and manage your payments."
      />

      <ComingSoonSection />

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <UsageOverview />

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(PLANS).map(([key, plan]) => {
              const planKey = key as PlanKey;
              const isCurrentPlan =
                planKey === "pro" && isProActive;

              return (
                <Card key={planKey} className={isCurrentPlan ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          Current Plan
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      ${plan.price}
                      <span className="ml-2 text-sm text-muted-foreground">
                        /{plan.interval.toLowerCase()}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {plan.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      {planKey === "pro" ? (
                        <UpgradeButton
                          planKey={planKey}
                          disabled={isCurrentPlan}
                        />
                      ) : (
                        <button
                          disabled
                          className="w-full rounded-md border border-muted bg-muted px-4 py-2 text-sm text-muted-foreground font-semibold"
                        >
                          {currentPlan === "free" ? "Current Plan" : "Included"}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
