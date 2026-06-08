"use client";

import { motion } from "framer-motion";
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
    <section id="features" className="py-24 md:py-32 border-t border-border/60 bg-black relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white"
          >
            Everything you need. <br className="hidden md:block" />
            <span className="text-primary">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
          >
            {"// Built to solve the exact bottlenecks developers face with legacy analytics tools."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative p-6 border border-border bg-card hover:border-primary/50 transition-colors duration-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground/30 font-bold">
                  [0{index + 1}]
                </span>
              </div>
              <h3 className="text-sm font-heading font-bold uppercase text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-xs text-muted-foreground font-mono uppercase leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
