"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-emerald-500/30 blur-[120px] rounded-full mix-blend-multiply filter dark:mix-blend-soft-light" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-md shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">v1.0 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight max-w-5xl mb-8 leading-[1.1]"
          >
            Analytics{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              without the clutter
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed"
          >
            Privacy-friendly, real-time analytics for modern SaaS. Get the insights you actually need with a lightning-fast platform built for speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95">
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#dashboard-preview">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg glass transition-all hover:bg-background/80">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 md:mt-32 relative mx-auto max-w-6xl"
          id="dashboard-preview"
        >
          <div className="rounded-2xl glass p-3 md:p-6 shadow-2xl shadow-blue-500/10 ring-1 ring-white/20">
            <div className="rounded-xl border bg-card overflow-hidden">
              {/* Mock Window Header */}
              <div className="h-10 border-b flex items-center px-4 gap-2 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="mx-auto flex items-center justify-center h-6 px-3 rounded-md bg-background border text-xs text-muted-foreground shadow-sm">
                  pulsestat.com/dashboard
                </div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="p-4 md:p-8 grid gap-4 md:gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold tracking-tight">Overview</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    12 Active Visitors
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Pageviews", value: "45.2K", icon: BarChart3, trend: "+12.5%" },
                    { label: "Unique Visitors", value: "12.8K", icon: Users, trend: "+5.2%" },
                    { label: "Bounce Rate", value: "42.3%", icon: Activity, trend: "-2.1%" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 md:p-6 rounded-xl border bg-card shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
