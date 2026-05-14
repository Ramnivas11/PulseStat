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
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              A developer experience you&apos;ll actually enjoy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We know you hate bloating your codebase. That&apos;s why our tracker is engineered to be completely invisible to your users. It loads async, relies on <code className="bg-muted px-1.5 py-0.5 rounded text-sm">sendBeacon</code> for zero-impact transmission, and fully supports modern Single Page Applications out of the box.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Under 2KB gzipped footprint",
                "Automatic SPA route change detection",
                "No impact on Core Web Vitals",
                "Typescript ready"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border bg-[#0d1117] text-gray-300 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#161b22]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-gray-500">app/layout.tsx</span>
            </div>
            
            <div className="p-6 relative font-mono text-sm leading-relaxed overflow-x-auto">
              <pre>
                <code className="text-purple-400">export default</code> <code className="text-blue-400">function</code> <code className="text-yellow-300">RootLayout</code>({`{`} children {`}`} : ... ) {`{\n`}
                {`  `} <code className="text-blue-400">return</code> {`(\n`}
                {`    <html lang="en">\n`}
                {`      <head>\n`}
                <span className="bg-blue-500/10 px-2 rounded -ml-2 border-l-2 border-blue-500 block py-1">
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
                className="absolute top-4 right-4 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
