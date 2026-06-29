"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/magnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Staggered entrance for text content
    if (contentRef.current) {
      const elements = contentRef.current.children;
      gsap.from(elements, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1
      });
    }

    // Entrance for dashboard
    if (dashboardRef.current) {
      gsap.from(dashboardRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4
      });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-transparent border-b border-border/40">
      {/* Brutalist Noise & Grid Texture (Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div ref={contentRef} className="flex flex-col items-center text-center">
          <div className="inline-flex items-center border border-border px-3 py-1 text-xs font-mono text-foreground mb-12  ">
            <span className="flex h-1.5 w-1.5 bg-foreground mr-2.5" />
            STATUS: ACTIVE // SYSTEM_VER_1.0.0
          </div>

          <h1 className="flex flex-col items-center font-heading font-black tracking-tighter w-full mb-10 leading-[0.9] text-foreground ">
            <span className="text-5xl md:text-7xl lg:text-[100px]">Analytics</span>
            <span className="text-3xl md:text-5xl lg:text-[70px] font-normal italic lowercase mt-2 mb-2 font-body text-muted-foreground">without the</span>
            <span className="text-7xl md:text-[120px] lg:text-[160px] tracking-tighter">Clutter</span>
          </h1>

          <p className="text-base md:text-lg font-mono   text-muted-foreground max-w-3xl mb-16 leading-relaxed">
            {"// Privacy-friendly, real-time analytics for modern SaaS. Get the telemetry you actually need with an infrastructure-grade engine."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Magnetic>
              <Link href="/signup">
                <Button size="lg" className="rounded-[var(--radius-marketing)] px-8 h-14 text-sm font-mono   bg-foreground text-background hover:bg-background hover:text-foreground border border-foreground transition-colors duration-100">
                  START_TRACKING_FREE
                </Button>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="#dashboard-preview">
                <Button size="lg" variant="outline" className="rounded-[var(--radius-marketing)] px-8 h-14 text-sm font-mono   border-border hover:bg-secondary/50 hover:text-foreground text-foreground bg-transparent transition-colors duration-100">
                  VIEW_DEMO_NODE
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Dashboard Mockup - Terminal Telemetry Panel */}
        <div
          ref={dashboardRef}
          className="mt-24 md:mt-32 relative mx-auto max-w-5xl"
          id="dashboard-preview"
        >
          <div className="border border-border bg-background p-3 shadow-none relative">
            <div className="absolute -top-[2px] -left-[2px] w-3 h-3 border-t-4 border-l-4 border-foreground" />
            <div className="absolute -top-[2px] -right-[2px] w-3 h-3 border-t-4 border-r-4 border-foreground" />
            <div className="absolute -bottom-[2px] -left-[2px] w-3 h-3 border-b-4 border-l-4 border-foreground" />
            <div className="absolute -bottom-[2px] -right-[2px] w-3 h-3 border-b-4 border-r-4 border-foreground" />

            <div className="border border-border bg-background overflow-hidden">
              {/* Mock Window Header */}
              <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-muted font-mono text-[10px]  text-muted-foreground ">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-foreground" />
                  <div className="w-2 h-2 bg-foreground" />
                  <div className="w-2 h-2 bg-foreground" />
                </div>
                <div className="flex items-center px-3 py-1 border border-border bg-background text-foreground text-[9px]">
                  HTTPS://PULSESTAT.COM/CONSOLE/DASHBOARD
                </div>
                <span className="text-foreground">SYS_ONLINE</span>
              </div>

              {/* Mock Dashboard Content */}
              <div className="p-4 md:p-8 grid gap-8 bg-background">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono  text-muted-foreground ">{"// live statistics"}</span>
                    <h2 className="text-xl font-heading font-black tracking-tight  text-foreground">Console Overview</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono  text-foreground border border-border px-3 py-1">
                    <span className="w-1.5 h-1.5 bg-foreground" />
                    LIVE_ACTIVE_VISITORS: 12
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: "Total Pageviews", value: "45,204", trend: "+12.5% // OK", color: "text-foreground" },
                    { label: "Unique Visitors", value: "12,819", trend: "+5.2% // OK", color: "text-foreground" },
                    { label: "Bounce Rate", value: "42.3%", trend: "-2.1% // DECR", color: "text-foreground" },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 border border-border bg-background relative hover:bg-secondary/50 hover:text-foreground transition-colors duration-100 group">
                      <div className="flex justify-between items-center mb-6 font-mono text-[9px]  ">
                        <span className="text-muted-foreground group-hover:text-background">{stat.label}</span>
                        <span className={`px-2 py-1 border border-border bg-background group-hover:bg-background group-hover:text-foreground ${stat.color}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-mono font-bold tracking-tight text-foreground group-hover:text-background mb-2">{stat.value}</div>
                      <span className="text-[10px] font-mono text-muted-foreground group-hover:text-background  block">NODE_STAT_[0{i + 1}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
