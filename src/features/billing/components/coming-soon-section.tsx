import { Check } from "lucide-react";

const features = [
  "Realtime dashboards with live event streams",
  "Advanced workspace and team controls",
  "Custom exports for reports and analysis",
  "AI-powered insights and alerts",
  "Priority support and onboarding guidance",
];

export function ComingSoonSection() {
  return (
    <section className="rounded-3xl border border-muted bg-gradient-to-br from-slate-950/80 via-slate-900 to-slate-950 p-8 text-white shadow-2xl">
      <div className="max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Coming Soon
          </p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Pro analytics is landing soon.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            We are building the next level of PulseStat subscriptions with premium insights, team controls, and enterprise-ready reporting.
            Stay tuned for a strong launch.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Check className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
