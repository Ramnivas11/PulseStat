"use client";

import { useEffect, useState } from "react";
import { Activity, MapPin, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RealtimeEvent {
  sessionId: string;
  path: string;
  referrerDomain?: string | null;
  country?: string | null;
  eventName?: string | null;
  createdAt: string;
}

interface RealtimeData {
  activeVisitors: number;
  recentEvents: RealtimeEvent[];
  topPaths: { path: string; count: number }[];
  topCountries: { country: string; count: number }[];
  totals: { pageviews: number; visitors: number };
  polledAt: string;
}

interface RealtimeCardProps {
  websiteId: string;
}

const POLL_MS = 10_000;

export function RealtimeCard({ websiteId }: RealtimeCardProps) {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetch_(initial = false) {
      if (initial) setLoading(true);
      try {
        const res = await fetch(`/api/realtime/${websiteId}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json() as { data: RealtimeData };
        if (mounted) { setData(json.data); setError(null); }
      } catch (e) {
        if (mounted && !(e instanceof DOMException && e.name === "AbortError")) {
          setError("Realtime unavailable");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void fetch_(true);
    const interval = setInterval(() => void fetch_(false), POLL_MS);
    return () => { mounted = false; controller.abort(); clearInterval(interval); };
  }, [websiteId]);

  const active = data?.activeVisitors ?? 0;

  return (
    <Card className="relative glass shadow-lg border-white/20 transition-all hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Visitors
            </CardTitle>
            <CardDescription className="text-xs">Last 5 minutes</CardDescription>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="h-4 w-4" aria-hidden />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {loading ? "—" : active.toLocaleString()}
          </p>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </div>
        </div>

        {/* Mini stats row */}
        {data && (
          <div className="flex gap-3 text-xs text-muted-foreground border-t pt-2">
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{data.totals.pageviews} views</span>
            <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{data.totals.visitors} uniq</span>
          </div>
        )}

        {/* Top paths (last 30 min) */}
        {data && data.topPaths.length > 0 && (
          <div className="space-y-1 border-t pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top paths (30 min)</p>
            {data.topPaths.slice(0, 4).map((p) => (
              <div key={p.path} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[120px] font-mono text-muted-foreground">{p.path}</span>
                <span className="font-medium">{p.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top countries */}
        {data && data.topCountries.length > 0 && (
          <div className="space-y-1 border-t pt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Countries
            </p>
            {data.topCountries.slice(0, 3).map((c) => (
              <div key={c.country} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.country}</span>
                <span className="font-medium">{c.count}</span>
              </div>
            ))}
          </div>
        )}

        <p className="min-h-4 text-xs text-muted-foreground">
          {error ?? (loading ? "Loading…" : "Updates every 10s")}
        </p>
      </CardContent>
    </Card>
  );
}
