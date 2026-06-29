"use client";

import { Code, LayoutDashboard } from "lucide-react";
import { CreateWebsiteForm } from "@/features/websites/components/create-website-form";

export function GettingStarted() {
  return (
    <div className="rounded-none border-sharp bg-black text-white shadow-none">
      <div className="flex flex-col p-6 space-y-2 border-b border-border bg-muted/5">
        <h3 className="font-heading text-xl font-black uppercase tracking-widest text-white">Welcome to PulseStat</h3>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {"// Follow these simple steps to start tracking your website analytics."}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {/* Step 1: Create Website */}
          <div className="flex gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-primary/30 bg-primary/10 text-primary">
              <span className="font-mono text-xs font-bold">01</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white">Add your first website</h4>
                <p className="mt-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {"// Register the domain you want to track"}
                </p>
              </div>
              <div className="max-w-md border border-border">
                <CreateWebsiteForm />
              </div>
            </div>
          </div>

          {/* Step 2: Install Script */}
          <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-border bg-muted/10 text-muted-foreground">
              <span className="font-mono text-xs font-bold">02</span>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                Install the tracking script
                <Code className="h-4 w-4 text-muted-foreground" />
              </h4>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {"// Copy the snippet to your website's <head> tag"}
              </p>
            </div>
          </div>

          {/* Step 3: View Dashboard */}
          <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-border bg-muted/10 text-muted-foreground">
              <span className="font-mono text-xs font-bold">03</span>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                View your dashboard
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </h4>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {"// Watch the analytics roll in real-time"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
