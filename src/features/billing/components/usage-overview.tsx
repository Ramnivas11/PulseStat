"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UpgradeButton } from "./upgrade-button";
import type { UsageSummary } from "@/features/billing/services/billing.service";
import { apiGet } from "@/lib/api-client";

export function UsageOverview() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchUsage() {
      try {
        const res = await apiGet<{ ok: boolean; data: UsageSummary }>("/api/usage");
        if (!mounted) return;
        if (res.ok && res.data?.ok) {
          setUsage(res.data.data);
        } else {
          console.error("Usage API error:", res.ok ? "Failed response status" : res.error);
        }
      } catch (error) {
        console.error("Failed to fetch usage data", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchUsage();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="relative">
        <CardHeader className="border-b border-border bg-muted/10 pb-4">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// resource validation"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-white block">Usage Overview</span>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[100px] animate-pulse bg-muted/30 border border-border" />
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return (
      <Card className="relative">
        <CardHeader className="border-b border-border bg-muted/10 pb-4">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// resource validation"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-white block">Usage Overview</span>
        </CardHeader>
        <CardContent className="pt-6 font-mono text-xs text-muted-foreground uppercase">
          {"// ERR: Unable to load usage metrics"}
        </CardContent>
      </Card>
    );
  }

  const toNumber = (v: unknown) => (typeof v === "string" ? parseInt(v, 10) || 0 : Number(v) || 0);

  const websiteUsed = toNumber(usage.websites.used);
  const websiteLimit = toNumber(usage.websites.limit);
  const eventUsed = toNumber(usage.events.used);
  const eventLimit = toNumber(usage.events.limit);

  const websitePercent = Math.min(100, (websiteUsed / Math.max(1, websiteLimit)) * 100);
  const eventPercent = Math.min(100, (eventUsed / Math.max(1, eventLimit)) * 100);

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    return "bg-primary";
  };

  return (
    <Card className="relative hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-muted/10 pb-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// resource validation"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-white block">Usage Overview</span>
        </div>
        <div className="border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[9px] text-primary uppercase">
          {usage.plan}_PLAN
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Websites Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="uppercase text-muted-foreground">Websites</span>
            <span className="text-white">
              {usage.websites.used.toLocaleString()} /{" "}
              {usage.websites.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 w-full bg-black border border-border rounded-none overflow-hidden">
            <div
              className={`h-full ${getProgressColor(websitePercent)} transition-all`}
              style={{ width: `${websitePercent}%` }}
            />
          </div>
        </div>

        {/* Events Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="uppercase text-muted-foreground">Monthly Events</span>
            <span className="text-white">
              {usage.events.used.toLocaleString()} /{" "}
              {usage.events.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 w-full bg-black border border-border rounded-none overflow-hidden">
            <div
              className={`h-full ${getProgressColor(eventPercent)} transition-all`}
              style={{ width: `${eventPercent}%` }}
            />
          </div>
        </div>

        {/* Upgrade CTA if close to limits */}
        {usage.plan === "free" && (eventPercent >= 70 || websitePercent >= 100) && (
          <div className="pt-2">
            <div className="border border-border bg-muted/10 p-4 rounded-none">
              <h4 className="mb-1 font-mono text-xs uppercase text-white font-bold">Approaching Limits</h4>
              <p className="mb-4 font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">
                {"// Upgrade to pro to activate unlimited nodes and metrics."}
              </p>
              <UpgradeButton planKey="pro" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
