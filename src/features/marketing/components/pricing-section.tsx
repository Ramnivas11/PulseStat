"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/config/plans";
import { Magnetic } from "@/components/shared/magnetic";

export function PricingSection() {
  const freePlan = PLANS.free;
  const proPlan = PLANS.pro;

  return (
    <section id="pricing" className="py-24 md:py-36 relative overflow-hidden bg-transparent border-b border-border/40">
      {/* Brutalist Noise & Grid Texture (Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4  text-foreground">
            Pricing Architecture
          </h2>
          <p className="text-xs font-mono   text-muted-foreground">
            {"// Start tracking with zero cost. Upgrade as metrics volume scales."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-center">
          {/* Free Plan */}
          <div className="flex flex-col p-8 md:p-10 border border-border bg-background relative rounded-[var(--radius-marketing)] transition-colors h-full">
            <span className="font-mono text-[10px] text-muted-foreground  mb-2">PLAN_TYPE // 01</span>
            <h3 className="text-xl font-heading font-bold  tracking-tight text-foreground mb-2">{freePlan.name}</h3>
            <p className="text-xs font-mono  text-muted-foreground mb-8">{freePlan.description}</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-mono font-bold tracking-tight text-foreground">₹{freePlan.price}</span>
              <span className="font-mono text-xs text-muted-foreground  ml-2">/{freePlan.interval.toLowerCase()}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {freePlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center border border-border bg-background text-foreground shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono  text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Magnetic className="w-full mt-auto">
              <Link href="/signup" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-[var(--radius-marketing)] font-mono text-xs  bg-transparent text-foreground border-border hover:bg-secondary/50 hover:text-foreground transition-colors duration-100">
                  GET_STARTED
                </Button>
              </Link>
            </Magnetic>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col p-8 md:p-14 border border-border bg-foreground relative rounded-[var(--radius-marketing)] transition-colors md:-my-6 h-auto min-h-[105%]">
            <div className="absolute top-4 right-4 px-2 py-0.5 border border-background bg-foreground text-background text-[9px] font-mono  ">
              sys_recommended
            </div>

            <span className="font-mono text-[10px] text-background/60  mb-2">PLAN_TYPE // 02</span>
            <h3 className="text-xl font-heading font-bold  tracking-tight text-background mb-2">{proPlan.name}</h3>
            <p className="text-xs font-mono  text-background/80 mb-8">{proPlan.description}</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-mono font-bold tracking-tight text-background">₹{proPlan.price}</span>
              <span className="font-mono text-xs text-background/60  ml-2">/{proPlan.interval.toLowerCase()}</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {proPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center border border-background bg-foreground text-background shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono  text-background/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Magnetic className="w-full mt-auto">
              <Link href="/signup" className="w-full">
                <Button className="w-full h-14 rounded-[var(--radius-marketing)] font-mono text-xs  bg-background text-foreground hover:bg-background/90 transition-colors duration-100">
                  {"GO_PREMIUM // SUBSCRIBE"}
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
