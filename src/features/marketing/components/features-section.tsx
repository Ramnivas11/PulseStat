"use client";

import { Activity, Shield, Zap, Globe2, Code2, LineChart } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Analytics",
    description: "Watch your visitors navigate your site as it happens. No more waiting 24 hours for daily batch updates.",
  },
  {
    icon: Shield,
    title: "Privacy-Friendly",
    description: "No cookies, no IP tracking, no GDPR banners required. We respect your users' privacy out of the box.",
  },
  {
    icon: Zap,
    title: "Lightweight Tracker",
    description: "Our tracking script is less than 2KB. It won't slow down your website or hurt your Core Web Vitals.",
  },
  {
    icon: Globe2,
    title: "Multi-Website Support",
    description: "Manage all your side-projects and client websites from a single, unified dashboard.",
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "Built for the modern web. Works perfectly with React, Next.js App Router, Vue, and all SPA frameworks.",
  },
  {
    icon: LineChart,
    title: "Actionable Dashboards",
    description: "We stripped away the vanity metrics and complex menus. See what matters, instantly.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-transparent relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight mb-4 text-foreground">
            Everything you need. <br className="hidden md:block" />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Built to solve the exact bottlenecks developers face with legacy analytics tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-elevation rounded-[var(--radius-marketing)] overflow-hidden ${
                index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Optional Lime Accent Glow on the big tiles */}
              {(index === 0 || index === 3) && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9F26C] opacity-20 blur-3xl rounded-full pointer-events-none group-hover:opacity-40 transition-opacity duration-500"></div>
              )}
              
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 rounded-full border border-border/50 bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-medium text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
