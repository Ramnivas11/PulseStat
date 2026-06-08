"use client";

import { motion } from "framer-motion";
import { PlusCircle, Code2, LineChart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: PlusCircle,
      title: "Add a website",
      description: "Enter your domain name in the dashboard to generate a unique tracking ID.",
    },
    {
      icon: Code2,
      title: "Paste the snippet",
      description: "Drop a single, lightweight <script> tag into your website's <head>.",
    },
    {
      icon: LineChart,
      title: "See the data",
      description: "Watch your dashboard light up instantly as visitors hit your site.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-black border-y border-border">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-4 uppercase text-white"
          >
            Up and running in <span className="text-primary">2 minutes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
          >
            {"// No complicated tag managers. No cookie banners. Just instant connection."}
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-[32px] left-0 w-full h-[1px] bg-border hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 border border-border bg-card flex items-center justify-center mb-6 relative">
                  <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-primary" />
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-heading font-bold uppercase text-white mb-3 tracking-tight">
                  [0{i + 1}] {step.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono uppercase leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
