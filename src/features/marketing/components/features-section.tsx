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
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Everything you need. <br className="hidden md:block" />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            We built PulseStat to solve the exact problems developers face with legacy analytics tools.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 md:p-8 rounded-3xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
