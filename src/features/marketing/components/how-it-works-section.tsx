"use client";

import { motion } from "framer-motion";
import { PlusCircle, Code2, LineChart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: PlusCircle,
      title: "1. Add a website",
      description: "Enter your domain name in the dashboard to generate a unique tracking ID.",
    },
    {
      icon: Code2,
      title: "2. Paste the snippet",
      description: "Drop a single, lightweight <script> tag into your website's <head>.",
    },
    {
      icon: LineChart,
      title: "3. See the data",
      description: "Watch your dashboard light up instantly as visitors hit your site.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 border-y">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Up and running in <span className="text-primary">2 minutes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            No complicated Google Tag Manager setups. No cookie banners to configure. Just simple, honest tracking.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-background border-4 border-muted flex items-center justify-center shadow-xl mb-6 relative">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground max-w-sm">
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
