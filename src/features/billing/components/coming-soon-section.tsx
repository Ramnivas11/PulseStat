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
    <section className="rounded-none border border-border bg-black p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      
      <div className="max-w-3xl space-y-6">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-4">
            {"// Coming Soon"}
          </p>
          <h2 className="text-3xl font-heading font-black tracking-tight uppercase">
            Pro analytics is landing soon.
          </h2>
          <p className="mt-4 max-w-2xl text-xs font-mono uppercase tracking-wider text-muted-foreground leading-relaxed">
            We are building the next level of PulseStat subscriptions with premium insights, team controls, and enterprise-ready reporting.
            Stay tuned for a strong launch.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-8 pt-8 border-t border-border">
          {features.map((feature) => (
            <div key={feature} className="rounded-none border border-border bg-muted/5 p-4 flex items-start gap-3">
              <span className="text-primary mt-0.5">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
