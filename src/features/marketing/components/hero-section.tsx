"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-black">
      {/* Brutalist Telemetry Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]" />

      {/* Cybernetic Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-mono text-primary mb-8 tracking-widest uppercase"
          >
            <span className="flex h-1.5 w-1.5 bg-primary mr-2.5 animate-pulse" />
            STATUS: ACTIVE // SYSTEM_VER_1.0.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight max-w-4xl mb-8 leading-[1.1] text-white uppercase"
          >
            Analytics{" "}
            <span className="text-primary border-b-2 border-primary/30 px-1">
              without the clutter
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm md:text-base font-mono uppercase tracking-wider text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            {"// Privacy-friendly, real-time analytics for modern SaaS. Get the telemetry you actually need with an infrastructure-grade engine."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="rounded-none px-6 h-12 text-sm font-mono uppercase tracking-wider bg-primary hover:bg-primary/95 text-white active:scale-95">
                START_TRACKING_FREE
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#dashboard-preview">
              <Button size="lg" variant="outline" className="rounded-none px-6 h-12 text-sm font-mono uppercase tracking-wider border-border hover:border-primary text-muted-foreground hover:text-white bg-transparent">
                VIEW_DEMO_NODE
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup - Terminal Telemetry Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 md:mt-28 relative mx-auto max-w-5xl"
          id="dashboard-preview"
        >
          <div className="border border-border bg-black p-2.5 shadow-none relative">
            {/* Absolute accent border corners */}
            <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-primary" />

            <div className="border border-border/80 bg-card overflow-hidden">
              {/* Mock Window Header */}
              <div className="h-10 border-b border-border flex items-center px-4 justify-between bg-muted/40 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-neutral-800 border border-neutral-700" />
                  <div className="w-2 h-2 bg-neutral-800 border border-neutral-700" />
                  <div className="w-2 h-2 bg-neutral-800 border border-neutral-700" />
                </div>
                <div className="flex items-center px-3 py-0.5 border border-border bg-black text-[9px]">
                  HTTPS://PULSESTAT.COM/CONSOLE/DASHBOARD
                </div>
                <span className="text-primary/70">SYS_ONLINE</span>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="p-4 md:p-6 grid gap-6 bg-black">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/40 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">{"// live statistics"}</span>
                    <h2 className="text-lg font-heading font-black tracking-tight uppercase text-white">Console Overview</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                    LIVE_ACTIVE_VISITORS: 12
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Pageviews", value: "45,204", trend: "+12.5% // OK", color: "text-primary" },
                    { label: "Unique Visitors", value: "12,819", trend: "+5.2% // OK", color: "text-primary" },
                    { label: "Bounce Rate", value: "42.3%", trend: "-2.1% // DECR", color: "text-red-400" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 border border-border bg-card relative hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-center mb-4 font-mono text-[9px] uppercase tracking-widest">
                        <span className="text-muted-foreground">{stat.label}</span>
                        <span className={`px-1.5 py-0.5 border border-border bg-black ${stat.color}`}>
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-2xl font-mono font-bold tracking-tight text-white mb-1">{stat.value}</div>
                      <span className="text-[9px] font-mono text-muted-foreground/40 uppercase block">NODE_STAT_[0{i+1}]</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
