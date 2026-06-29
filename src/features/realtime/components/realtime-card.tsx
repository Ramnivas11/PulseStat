"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [windowSeconds, setWindowSeconds] = useState(30);

  useEffect(() => {
    let isMounted = true;
    let isInFlight = false;
    let activeController: AbortController | null = null;

    async function fetchRealtime(isInitialLoad = false) {
      if (isInFlight) return;

      isInFlight = true;
      activeController = new AbortController();

      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const res = await fetch(`/api/realtime/${websiteId}`, {
          signal: activeController.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Unable to load realtime data");
        }

        const data = (await res.json()) as RealtimeResponse;

        if (!isMounted) return;

        setActiveVisitors(data.activeVisitors);
        setWindowSeconds(data.windowSeconds);
        setLastUpdated(data.polledAt);
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
        isInFlight = false;

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
      activeController?.abort();
      clearInterval(interval);
    };
  }, [websiteId]);

  return (
    <Card className="relative rounded-none border-sharp bg-black hover:border-primary/50 transition-colors duration-200">
      {/* Corner indicators for telemetry look */}
      <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute top-0 right-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute bottom-0 left-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute bottom-0 right-0 w-[1px] h-[1px] bg-primary" />

      <CardHeader className="pb-1 border-b border-border bg-muted/5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase block">
              {"// Active Visitors"}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/60 uppercase block">
              window: {windowSeconds}s
            </span>
          </div>

          <div className="flex h-7 w-7 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4 pt-0">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-mono font-bold tracking-tight text-white">
            {isLoading ? "--" : activeVisitors.toLocaleString()}
          </p>

          <div className="mb-1.5 flex items-center gap-2 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 uppercase tracking-wider">
            <span
              className="relative flex h-1.5 w-1.5"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-none bg-emerald-500" />
            </span>
            LIVE
          </div>
        </div>

        <div className="min-h-4 font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
          {error
            ? `// ERR: ${error}`
            : isRefreshing
              ? "// REFRESHING_STREAM..."
              : lastUpdated
                ? `// SYNC_OK: ${new Date(lastUpdated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}`
                : "// LISTENING_PORT"}
        </div>
      </CardContent>
    </Card>
  );
}
