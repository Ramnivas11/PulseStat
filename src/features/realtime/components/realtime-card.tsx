"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RealtimeCardProps {
  websiteId: string;
}

interface RealtimeResponse {
  activeVisitors: number;
  windowSeconds: number;
  polledAt: string;
}

const POLLING_INTERVAL_MS = 10 * 1000;

export function RealtimeCard({
  websiteId,
}: RealtimeCardProps) {
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchRealtime(isInitialLoad = false) {
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const res = await fetch(`/api/realtime/${websiteId}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Unable to load realtime data");
        }

        const data = (await res.json()) as RealtimeResponse;

        if (!isMounted) return;

        setActiveVisitors(data.activeVisitors);
        setError(null);
      } catch (error) {
        if (
          !isMounted ||
          (error instanceof DOMException &&
            error.name === "AbortError")
        ) {
          return;
        }

        setError("Realtime data is temporarily unavailable");
      } finally {
        if (!isMounted) return;

        setIsLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchRealtime(true);

    const interval = setInterval(
      () => fetchRealtime(false),
      POLLING_INTERVAL_MS
    );

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [websiteId]);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Active Visitors</CardTitle>
            <CardDescription>Last 30 seconds</CardDescription>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <p className="text-5xl font-semibold tracking-normal">
            {isLoading ? "--" : activeVisitors.toLocaleString()}
          </p>

          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span
              className="relative flex h-2.5 w-2.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>

        <div className="min-h-5 text-xs text-muted-foreground">
          {error
            ? error
            : isRefreshing
              ? "Refreshing..."
              : "Updates every 10 seconds"}
        </div>
      </CardContent>
    </Card>
  );
}
