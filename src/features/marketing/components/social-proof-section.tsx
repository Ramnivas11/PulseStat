"use client";

import { motion } from "framer-motion";

export function SocialProofSection() {
  return (
    <section className="py-10 border-b border-border bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">
            {"// TRUSTED BY MODERN INFRASTRUCTURE TEAMS"}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full items-center justify-center font-mono text-[11px] tracking-wider uppercase text-muted-foreground/60">
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-primary transition-colors">
              <span>[ ACME_CORP ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-primary transition-colors">
              <span>[ GLOBEX_SYS ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-primary transition-colors">
              <span>[ SOYLENT_NET ]</span>
            </div>
            <div className="flex items-center justify-center border border-border/40 py-2.5 bg-card hover:text-primary transition-colors">
              <span>[ INITECH_DEV ]</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
