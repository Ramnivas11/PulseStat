"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/config/plans";

export function PricingSection() {
  const freePlan = PLANS.free;
  const proPlan = PLANS.pro;

  return (
    <section id="pricing" className="py-24 md:py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium"
          >
            Start tracking for free. Upgrade when you need more power.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col p-10 rounded-[2.5rem] glass border-white/20 shadow-xl relative group transition-all hover:scale-[1.02]"
          >
            <h3 className="text-2xl font-black mb-2 uppercase tracking-wider text-muted-foreground/60">{freePlan.name}</h3>
            <p className="text-muted-foreground mb-8 text-lg font-medium">{freePlan.description}</p>
            <div className="mb-10 flex items-baseline">
              <span className="text-6xl font-black tracking-tighter">₹{freePlan.price}</span>
              <span className="text-muted-foreground font-bold ml-2">/{freePlan.interval.toLowerCase()}</span>
            </div>
            
            <ul className="space-y-5 mb-12 flex-1">
              {freePlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 shadow-inner">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base font-semibold text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/signup" className="w-full mt-auto">
              <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold glass transition-all hover:bg-background/80">
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col p-10 rounded-[2.5rem] border-2 border-primary bg-primary text-primary-foreground shadow-2xl shadow-blue-500/30 relative overflow-hidden group transition-all hover:scale-[1.02]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Check className="h-32 w-32" />
            </div>

            <div className="absolute top-6 right-6 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
              Recommended
            </div>
            
            <h3 className="text-2xl font-black mb-2 uppercase tracking-wider text-white/70">{proPlan.name}</h3>
            <p className="text-white/80 mb-8 text-lg font-medium">{proPlan.description}</p>
            <div className="mb-10 flex items-baseline">
              <span className="text-6xl font-black tracking-tighter">₹{proPlan.price}</span>
              <span className="text-white/60 font-bold ml-2">/{proPlan.interval.toLowerCase()}</span>
            </div>
            
            <ul className="space-y-5 mb-12 flex-1">
              {proPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shrink-0 shadow-inner">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base font-bold text-white/90">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/signup" className="w-full mt-auto">
              <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/10 transition-all">
                Go Premium
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
