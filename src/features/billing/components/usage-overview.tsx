"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpgradeButton } from "./upgrade-button";
import type { UsageSummary } from "@/features/billing/services/billing.service";

export function UsageOverview() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch (error) {
        console.error("Failed to fetch usage data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[100px] animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!usage) {
    return null;
  }

  const websitePercent = Math.min(
    100,
    (usage.websites.used / usage.websites.limit) * 100
  );
  const eventPercent = Math.min(
    100,
    (usage.events.used / usage.events.limit) * 100
  );

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Usage Overview</CardTitle>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
          {usage.plan} Plan
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Websites Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Websites</span>
            <span className="text-muted-foreground">
              {usage.websites.used.toLocaleString()} /{" "}
              {usage.websites.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full ${getProgressColor(websitePercent)} transition-all`}
              style={{ width: `${websitePercent}%` }}
            />
          </div>
        </div>

        {/* Events Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Monthly Events</span>
            <span className="text-muted-foreground">
              {usage.events.used.toLocaleString()} /{" "}
              {usage.events.limit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full ${getProgressColor(eventPercent)} transition-all`}
              style={{ width: `${eventPercent}%` }}
            />
          </div>
        </div>

        {/* Upgrade CTA if close to limits */}
        {usage.plan === "free" && (eventPercent >= 70 || websitePercent >= 100) && (
          <div className="pt-2">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <h4 className="mb-1 font-semibold text-sm">Approaching limits</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Upgrade to Pro to track more events and add unlimited websites.
              </p>
              <UpgradeButton planKey="pro" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
