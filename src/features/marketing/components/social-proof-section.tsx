"use client";

import { motion } from "framer-motion";

export function SocialProofSection() {
  return (
    <section className="py-12 border-b bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <p className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
            Trusted by modern product teams
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* These would ideally be SVGs of logos. Using stylized text for the demo. */}
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold font-serif">Acme Corp</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xl font-black tracking-tighter">GLOBEX</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xl font-semibold flex items-center gap-1">
                <div className="w-4 h-4 bg-foreground rounded-sm" />
                Soylent
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold tracking-widest">INITECH</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
