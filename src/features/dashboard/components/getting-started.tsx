"use client";

import { Code, LayoutDashboard } from "lucide-react";
import { CreateWebsiteForm } from "@/features/websites/components/create-website-form";

export function GettingStarted() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col p-6 space-y-2 border-b">
        <h3 className="font-semibold tracking-tight text-xl">Welcome to PulseStat</h3>
        <p className="text-sm text-muted-foreground">
          Follow these simple steps to start tracking your website analytics.
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-8">
          {/* Step 1: Create Website */}
          <div className="flex gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="font-semibold">1</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-medium">Add your first website</h4>
                <p className="text-sm text-muted-foreground">
                  Register the domain you want to track.
                </p>
              </div>
              <div className="max-w-md">
                <CreateWebsiteForm />
              </div>
            </div>
          </div>

          {/* Step 2: Install Script */}
          <div className="flex gap-4 opacity-50 transition-opacity">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <span className="font-semibold">2</span>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-medium flex items-center gap-2">
                Install the tracking script
                <Code className="h-4 w-4" />
              </h4>
              <p className="text-sm text-muted-foreground">
                Copy the snippet to your website&apos;s &lt;head&gt; tag.
              </p>
            </div>
          </div>

          {/* Step 3: View Dashboard */}
          <div className="flex gap-4 opacity-50 transition-opacity">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <span className="font-semibold">3</span>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-medium flex items-center gap-2">
                View your dashboard
                <LayoutDashboard className="h-4 w-4" />
              </h4>
              <p className="text-sm text-muted-foreground">
                Watch the analytics roll in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
