"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

export function DeveloperExperienceSection() {
  const [copied, setCopied] = useState(false);
  const snippet = `<script async src="https://pulsestat.com/tracker.js" data-site-id="YOUR_SITE_ID"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast.success("Snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-white uppercase leading-tight">
              A developer experience you&apos;ll actually enjoy
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground leading-relaxed">
              {"// We know you hate bloating your codebase. That's why our tracker is engineered to be completely invisible to your users. It loads async, relies on "}
              <code className="bg-muted px-1.5 py-0.5 border border-border text-[10px]">sendBeacon</code>
              {" for zero-impact transmission, and fully supports modern Single Page Applications."}
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Under 2KB gzipped footprint",
                "Automatic SPA route change detection",
                "No impact on Core Web Vitals",
                "Typescript ready"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center border border-primary bg-primary/5 text-primary shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-mono text-xs uppercase text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-none border border-border bg-card shadow-none overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 border border-border bg-neutral-800" />
                <div className="w-2.5 h-2.5 border border-border bg-neutral-800" />
                <div className="w-2.5 h-2.5 border border-border bg-neutral-800" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">app/layout.tsx</span>
            </div>
            
            <div className="p-6 relative font-mono text-[11px] leading-relaxed overflow-x-auto bg-black/50 text-white">
              <pre>
                <code className="text-primary/70">export default</code> <code className="text-white/60">function</code> <code className="text-white">RootLayout</code>({`{`} children {`}`} : ... ) {`{\n`}
                {`  `} <code className="text-white/60">return</code> {`(\n`}
                {`    <html lang="en">\n`}
                {`      <head>\n`}
                <span className="bg-primary/5 px-2 -ml-2 border-l border-primary block py-1.5">
                  {`        <!-- PulseStat Tracker -->\n`}
                  {`        <script\n`}
                  {`          async\n`}
                  {`          src="https://pulsestat.com/tracker.js"\n`}
                  {`          data-site-id="<YOUR_SITE_ID>"\n`}
                  {`        />`}
                </span>
                {`      </head>\n`}
                {`      <body>{children}</body>\n`}
                {`    </html>\n`}
                {`  )\n`}
                {`}`}
              </pre>
              
              <Button 
                onClick={copyToClipboard}
                size="icon" 
                variant="outline" 
                className="absolute top-4 right-4 bg-card border-border hover:border-primary text-muted-foreground hover:text-white rounded-none size-7"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
