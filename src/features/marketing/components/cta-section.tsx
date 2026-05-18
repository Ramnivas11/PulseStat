"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-[100px] rounded-full mix-blend-multiply filter dark:mix-blend-soft-light" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card/50 backdrop-blur-xl border rounded-3xl p-8 md:p-16 shadow-2xl ring-1 ring-border/50"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to take back your analytics?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers and product teams building better software with PulseStat.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/25 w-full sm:w-auto">
                Create free account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Setup takes 2 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
