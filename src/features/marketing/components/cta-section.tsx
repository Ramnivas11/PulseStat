"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/shared/magnetic";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-transparent border-t border-border">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
        <div className="bg-card border border-border p-8 md:p-16 rounded-[var(--radius-marketing)] relative">
          <div className="absolute -top-[2px] -left-[2px] w-3 h-3 border-t-4 border-l-4 border-foreground" />
          <div className="absolute -bottom-[2px] -right-[2px] w-3 h-3 border-b-4 border-r-4 border-foreground" />

          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-6  text-white">
            Take Back Your Analytics
          </h2>
          <p className="text-xs font-mono   text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {"// Join modern product teams using PulseStat telemetry to measure growth in real-time."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-[var(--radius-marketing)] px-8 h-14 text-sm font-mono   w-full bg-foreground hover:bg-background hover:text-foreground text-background border border-foreground transition-colors duration-100">
                  CREATE_FREE_ACCOUNT
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Magnetic>
          </div>
          <p className="mt-6 text-[10px] font-mono   text-muted-foreground/50">
            {"// No credit card required. Setup takes 2 minutes."}
          </p>
        </div>
      </div>
    </section>
  );
}
