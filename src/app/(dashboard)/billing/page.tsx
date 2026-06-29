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
    <div className="space-y-12">
      <PageHeader
        title="Billing"
        description="Choose a plan, upgrade your account, and manage your payments."
      />

      <ComingSoonSection />

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <UsageOverview />

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">{"// Subscription Plans"}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(PLANS).map(([key, plan]) => {
                const planKey = key as PlanKey;
                const isCurrentPlan =
                  planKey === "pro" && isProActive;

                return (
                  <Card key={planKey} className={`rounded-none border-sharp bg-black ${isCurrentPlan ? "border-primary" : "border-border hover:border-primary/50 transition-colors"}`}>
                    <CardHeader className="border-b border-border bg-muted/5">
                      <CardTitle className="flex items-center justify-between font-heading font-bold uppercase tracking-wider text-sm">
                        {plan.name}
                        {isCurrentPlan && (
                          <span className="font-mono bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 text-[10px] uppercase">
                            Current Plan
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-4xl font-heading font-black tracking-tight text-white">
                        ${plan.price}
                        <span className="ml-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
                          /{plan.interval}
                        </span>
                      </p>
                      <p className="mt-4 text-xs font-mono text-muted-foreground uppercase tracking-wider leading-relaxed h-12">
                        {plan.description}
                      </p>

                      <ul className="mt-8 space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start text-xs font-mono text-muted-foreground uppercase">
                            <span className="text-primary mr-3 mt-0.5">{"->"}</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-10">
                        {planKey === "pro" ? (
                          <UpgradeButton
                            planKey={planKey}
                            disabled={isCurrentPlan}
                          />
                        ) : (
                          <button
                            disabled
                            className="w-full rounded-none border border-border bg-muted/10 px-4 py-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
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
    </div>
  );
}
