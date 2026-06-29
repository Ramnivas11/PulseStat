"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageOverview } from "@/features/billing/components/usage-overview";

import GeneralSection from "./sections/general";
import SecuritySection from "./sections/security";
import PreferencesSection from "./sections/preferences";
import ApiTrackingSection from "./sections/api-tracking";
import DangerZoneSection from "./sections/danger-zone";

const TABS = [
  { id: "general", label: "General" },
  { id: "usage", label: "Usage" },
  { id: "security", label: "Security" },
  { id: "preferences", label: "Preferences" },
  { id: "api", label: "API & Tracking" },
  { id: "danger", label: "Danger Zone" },
];

export default function SettingsShell() {
  const [tab, setTab] = useState<string>("general");

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <Card className="relative rounded-none border-sharp bg-black hover:border-primary/50 transition-colors duration-200">
            <CardHeader className="border-b border-border bg-muted/10 pb-4">
              <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// user_profile"}</span>
              <span className="font-heading text-base font-semibold tracking-tight text-foreground block">Settings</span>
            </CardHeader>
            <CardContent className="pt-4">
              <nav className="flex w-full flex-col space-y-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full rounded-none px-3 py-2 text-left text-[10px] font-mono uppercase tracking-wider transition-colors border-l border-transparent ${
                      tab === t.id 
                        ? "bg-muted/40 text-primary border-l-2 border-primary font-bold" 
                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          <div className="mt-6">
            <UsageOverview />
          </div>
        </aside>

        <main className="lg:col-span-3">
          <div className="space-y-6">
            {tab === "general" && <GeneralSection />}
            {tab === "usage" && <UsageOverview />}
            {tab === "security" && <SecuritySection />}
            {tab === "preferences" && <PreferencesSection />}
            {tab === "api" && <ApiTrackingSection />}
            {tab === "danger" && <DangerZoneSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
