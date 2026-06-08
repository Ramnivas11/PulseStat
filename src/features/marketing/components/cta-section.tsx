"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-black border-t border-border">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border p-8 md:p-16 rounded-none relative"
        >
          <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-primary" />
          <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-primary" />

          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-6 uppercase text-white">
            Take Back Your Analytics
          </h2>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {"// Join modern product teams using PulseStat telemetry to measure growth in real-time."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-none px-8 h-12 text-sm font-mono uppercase tracking-wider w-full bg-primary hover:bg-primary/95 text-white">
                CREATE_FREE_ACCOUNT
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
            {"// No credit card required. Setup takes 2 minutes."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
