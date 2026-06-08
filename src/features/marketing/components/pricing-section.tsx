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
    <section id="pricing" className="py-24 md:py-36 relative overflow-hidden bg-black border-t border-border">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white"
          >
            Pricing Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
          >
            {"// Start tracking with zero cost. Upgrade as metrics volume scales."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col p-8 md:p-10 border border-border bg-card relative rounded-none hover:border-muted-foreground/30 transition-colors"
          >
            <span className="font-mono text-[10px] text-muted-foreground/40 uppercase mb-2">PLAN_TYPE // 01</span>
            <h3 className="text-xl font-heading font-bold uppercase tracking-tight text-white mb-2">{freePlan.name}</h3>
            <p className="text-xs font-mono uppercase text-muted-foreground mb-8">{freePlan.description}</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-mono font-bold tracking-tight text-white">₹{freePlan.price}</span>
              <span className="font-mono text-xs text-muted-foreground uppercase ml-2">/{freePlan.interval.toLowerCase()}</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {freePlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center border border-border bg-black text-muted-foreground shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/signup" className="w-full mt-auto">
              <Button variant="outline" className="w-full h-12 rounded-none font-mono text-xs uppercase bg-transparent hover:bg-muted/30">
                GET_STARTED
              </Button>
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col p-8 md:p-10 border-2 border-primary bg-card relative rounded-none hover:border-primary/80 transition-colors"
          >
            <div className="absolute top-4 right-4 px-2 py-0.5 border border-primary bg-primary/10 text-primary text-[9px] font-mono uppercase tracking-widest">
              sys_recommended
            </div>
            
            <span className="font-mono text-[10px] text-primary/60 uppercase mb-2">PLAN_TYPE // 02</span>
            <h3 className="text-xl font-heading font-bold uppercase tracking-tight text-white mb-2">{proPlan.name}</h3>
            <p className="text-xs font-mono uppercase text-muted-foreground mb-8">{proPlan.description}</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-5xl font-mono font-bold tracking-tight text-white">₹{proPlan.price}</span>
              <span className="font-mono text-xs text-muted-foreground uppercase ml-2">/{proPlan.interval.toLowerCase()}</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {proPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center border border-primary bg-primary/5 text-primary shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono uppercase text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/signup" className="w-full mt-auto">
              <Button className="w-full h-12 rounded-none font-mono text-xs uppercase bg-primary hover:bg-primary/95 text-white">
                {"GO_PREMIUM // SUBSCRIBE"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
