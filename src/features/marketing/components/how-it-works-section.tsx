"use client";

import { PlusCircle, Code2, LineChart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: PlusCircle,
      title: "Add a website",
      description: "Enter your domain name in the dashboard to generate a unique tracking ID.",
    },
    {
      icon: Code2,
      title: "Paste the snippet",
      description: "Drop a single, lightweight <script> tag into your website's <head>.",
    },
    {
      icon: LineChart,
      title: "See the data",
      description: "Watch your dashboard light up instantly as visitors hit your site.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-transparent border-b border-border/40">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4  text-foreground">
            Up and running in <span className="text-foreground">2 minutes</span>
          </h2>
          <p className="text-xs font-mono   text-muted-foreground">
            {"// No complicated tag managers. No cookie banners. Just instant connection."}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-[32px] left-0 w-full h-[1px] bg-border hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-background pt-4 md:pt-0"
              >
                <div className="w-16 h-16 border border-border flex items-center justify-center mb-6 relative">
                  <step.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-sm font-heading font-bold  text-foreground mb-3 tracking-tight">
                  [0{i + 1}] {step.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono  leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
