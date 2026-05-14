"use client";

import { Code, LayoutDashboard, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateWebsiteForm } from "@/features/websites/components/create-website-form";

const steps = [
  {
    number: 1,
    icon: Globe,
    title: "Add your first website",
    description: "Register the domain you want to track.",
  },
  {
    number: 2,
    icon: Code,
    title: "Install the tracking script",
    description: "Copy the snippet to your website's <head> tag. Find it in Docs after creating a website.",
  },
  {
    number: 3,
    icon: LayoutDashboard,
    title: "View your dashboard",
    description: "Watch analytics appear in real time as visitors arrive.",
  },
];

export function GettingStarted() {
  return (
    <Card className="glass border-white/20 shadow-xl overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-5">
        <CardTitle className="text-xl font-bold">Welcome to PulseStat 👋</CardTitle>
        <CardDescription>
          Follow these steps to start tracking your website analytics.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8 pb-8">
        <div className="space-y-10">
          {/* Step 1 — active */}
          <div className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-blue-500/20">
                1
              </div>
              <div className="mt-2 w-px flex-1 bg-border" />
            </div>
            <div className="flex-1 space-y-5 pb-2">
              <div>
                <h4 className="font-semibold">Add your first website</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Register the domain you want to track.
                </p>
              </div>
              <div className="max-w-lg">
                <CreateWebsiteForm />
              </div>
            </div>
          </div>

          {/* Steps 2 & 3 — pending */}
          {steps.slice(1).map((step, i) => (
            <div key={step.number} className="flex gap-5 opacity-50">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-sm">
                  {step.number}
                </div>
                {i === 0 && <div className="mt-2 w-px flex-1 bg-border" />}
              </div>
              <div className="flex-1 space-y-1 pt-1.5">
                <h4 className="font-semibold flex items-center gap-2">
                  {step.title}
                  <step.icon className="h-4 w-4 text-muted-foreground" />
                </h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
