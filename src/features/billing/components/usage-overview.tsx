"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeButton } from "./upgrade-button";
import type { UsageSummary } from "@/features/billing/services/billing.service";

export function UsageOverview() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/usage")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((json) => { if (isMounted) setUsage(json.data ?? json); })
      .catch(() => { if (isMounted) setError(true); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !usage) return null;

  const websitePercent = Math.min(100, (usage.websites.used / usage.websites.limit) * 100);
  const eventPercent = Math.min(100, (usage.events.used / usage.events.limit) * 100);

  const getProgressColor = (p: number) => {
    if (p >= 90) return "bg-red-500";
    if (p >= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card className="glass border-white/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b bg-muted/30">
        <CardTitle className="text-base font-semibold">Usage Overview</CardTitle>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
          {usage.plan} Plan
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Websites</span>
            <span className="text-muted-foreground tabular-nums">
              {usage.websites.used.toLocaleString()} / {usage.websites.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full ${getProgressColor(websitePercent)} transition-all`}
              style={{ width: `${websitePercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Monthly Events</span>
            <span className="text-muted-foreground tabular-nums">
              {usage.events.used.toLocaleString()} / {usage.events.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full ${getProgressColor(eventPercent)} transition-all`}
              style={{ width: `${eventPercent}%` }}
            />
          </div>
        </div>

        {usage.plan === "free" && (eventPercent >= 70 || websitePercent >= 100) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20 p-4">
            <h4 className="mb-1 font-semibold text-sm text-amber-900 dark:text-amber-400">
              Approaching limits
            </h4>
            <p className="mb-3 text-xs text-amber-700 dark:text-amber-500/80">
              Upgrade to Pro to track more events and unlimited websites.
            </p>
            <UpgradeButton planKey="pro" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
