import { redirect } from "next/navigation";
import { formatDuration } from "@/lib/utils";
import {
  BarChart3, Eye, Globe2, MousePointerClick, Users,
  ArrowUpRight, Link2, Monitor, Clock, type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/features/websites/services/website.service";
import {
  getBrowserStats, getCountryStats, getDailyStats, getDashboardStats,
  getDeviceStats, getLanguageStats, getOSStats, getReferrerStats, getTopPages,
  getAvgSessionDuration, getUTMStats,
} from "@/features/analytics/services/analytics.service";
import { getAnalyticsDateRange, normalizeAnalyticsRange } from "@/features/analytics/services/date-range";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { RealtimeCard } from "@/features/realtime/components/realtime-card";
import { PageViewsChart } from "@/features/analytics/components/pageviews-chart";
import { WebsiteSelector } from "@/features/websites/components/website-selector";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { GettingStarted } from "@/features/dashboard/components/getting-started";
import { UsageOverview } from "@/features/billing/components/usage-overview";
import { RefreshButton } from "@/features/dashboard/components/refresh-button";
import { canCreateWebsite } from "@/features/billing/services/billing.service";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Dashboard", description: "Real-time analytics overview." };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Format seconds into "Xm Ys" or "Xs"
export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const siteId = typeof searchParams.siteId === "string" ? searchParams.siteId : null;
  const range = normalizeAnalyticsRange(typeof searchParams.range === "string" ? searchParams.range : undefined);
  const { startDate, endDate } = getAnalyticsDateRange(range);

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [websites, permission] = await Promise.all([
    getWebsitesByUserId(session.user.id),
    canCreateWebsite(session.user.id),
  ]);

  if (websites.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Create a website to start collecting analytics." />
        <div className="mx-auto mt-8 max-w-3xl">
          {permission.allowed ? <GettingStarted /> : (
            <UpgradePrompt
              title="Website limit reached"
              description={`You have ${permission.currentCount}/${permission.limit} websites on the ${permission.plan} plan.`}
            />
          )}
        </div>
      </div>
    );
  }

  const website = siteId ? (websites.find((w: { id: string }) => w.id === siteId) ?? websites[0]) : websites[0];

  const [stats, topPages, browsers, devices, dailyStats, osStats, countries, referrers, languages, avgDuration, utmSources, utmMediums, utmCampaigns] = await Promise.all([
    getDashboardStats(website.id, startDate, endDate),
    getTopPages(website.id, startDate, endDate),
    getBrowserStats(website.id, startDate, endDate),
    getDeviceStats(website.id, startDate, endDate),
    getDailyStats(website.id, startDate, endDate),
    getOSStats(website.id, startDate, endDate),
    getCountryStats(website.id, startDate, endDate),
    getReferrerStats(website.id, startDate, endDate),
    getLanguageStats(website.id, startDate, endDate),
    getAvgSessionDuration(website.id, startDate, endDate),
    getUTMStats(website.id, "utmSource", startDate, endDate),
    getUTMStats(website.id, "utmMedium", startDate, endDate),
    getUTMStats(website.id, "utmCampaign", startDate, endDate),
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,theme(colors.blue.500/0.18),transparent_34%),linear-gradient(135deg,theme(colors.background),theme(colors.muted/0.6))] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Realtime analytics active
            </div>
            <PageHeader title={website.name} description={`Analytics for ${website.domain}`} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <RefreshButton />
            <DateRangeSelector />
            <WebsiteSelector websites={websites} />
          </div>
        </div>
      </section>

      <UsageOverview />

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Pageviews" value={stats.pageviews.toLocaleString()} icon={Eye} description="Total page loads" />
        <StatsCard title="Visitors" value={stats.visitors.toLocaleString()} icon={Users} description="Unique visitors" />
        <StatsCard title="Sessions" value={stats.sessions.toLocaleString()} icon={MousePointerClick} description="Browsing sessions" />
        <StatsCard title="Bounce Rate" value={`${stats.bounceRate}%`} icon={ArrowUpRight} description="Single-page visits" />
        <StatsCard title="Avg. Duration" value={formatDuration(avgDuration)} icon={Clock} description="Avg. session length" />
      </div>

      {/* Traffic chart + right column */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <PageViewsChart data={dailyStats} />

        <div className="space-y-6">
          <RealtimeCard websiteId={website.id} />
          {/* Pages */}
          <MetricsCard
            title="Top Pages"
            icon={BarChart3}
            description="Most visited paths in range."
            items={topPages.map((p) => ({ label: p.path, count: p.views }))}
            empty="No page data yet."
            mono
          />
        </div>
      </div>

      {/* Breakdown panels — Umami style tabs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sources */}
        <Card className="glass shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Link2 className="h-5 w-5 text-primary" />
              Sources
            </CardTitle>
            <CardDescription>Where your visitors come from.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="referrers">
              <TabsList className="mb-4">
                <TabsTrigger value="referrers">Referrers</TabsTrigger>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
              </TabsList>
              <TabsContent value="referrers">
                <BreakdownList items={referrers.map((r) => ({ label: r.label || "Direct / None", count: r.count }))} empty="No referrer data yet." />
              </TabsContent>
              <TabsContent value="countries">
                <BreakdownList items={countries.map((c) => ({ label: c.label, count: c.count }))} empty="No country data yet." />
              </TabsContent>
              <TabsContent value="languages">
                <BreakdownList items={languages.map((l) => ({ label: l.label, count: l.count }))} empty="No language data yet." />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Environment */}
        <Card className="glass shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Monitor className="h-5 w-5 text-primary" />
              Environment
            </CardTitle>
            <CardDescription>Browser, OS, and device breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="browsers">
              <TabsList className="mb-4">
                <TabsTrigger value="browsers">Browsers</TabsTrigger>
                <TabsTrigger value="os">OS</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>
              <TabsContent value="browsers">
                <BreakdownList items={browsers.map((b) => ({ label: b.browser, count: b.count }))} empty="No browser data yet." />
              </TabsContent>
              <TabsContent value="os">
                <BreakdownList items={osStats.map((o) => ({ label: o.label, count: o.count }))} empty="No OS data yet." />
              </TabsContent>
              <TabsContent value="devices">
                <BreakdownList items={devices.map((d) => ({ label: d.device, count: d.count }))} empty="No device data yet." accent="emerald" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* UTM Attribution — Umami-style */}
      {(utmSources.length > 0 || utmMediums.length > 0 || utmCampaigns.length > 0) && (
        <Card className="glass shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              UTM Attribution
            </CardTitle>
            <CardDescription>Traffic from UTM-tagged campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="source">
              <TabsList className="mb-4">
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="campaign">Campaign</TabsTrigger>
              </TabsList>
              <TabsContent value="source">
                <BreakdownList items={utmSources.map((u) => ({ label: u.label, count: u.count }))} empty="No UTM source data." />
              </TabsContent>
              <TabsContent value="medium">
                <BreakdownList items={utmMediums.map((u) => ({ label: u.label, count: u.count }))} empty="No UTM medium data." />
              </TabsContent>
              <TabsContent value="campaign">
                <BreakdownList items={utmCampaigns.map((u) => ({ label: u.label, count: u.count }))} empty="No UTM campaign data." />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Shared UI components ──────────────────────────────────────────────────────

function MetricsCard({
  title, icon: Icon, description, items, empty, mono = false,
}: {
  title: string; icon: LucideIcon; description: string;
  items: { label: string; count: number }[]; empty: string; mono?: boolean;
}) {
  return (
    <Card className="glass overflow-hidden shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-5 w-5 text-primary" aria-hidden />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
            <Globe2 className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{empty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-medium">Path</TableHead>
                  <TableHead className="text-right font-medium">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell className={`max-w-64 truncate text-sm ${mono ? "font-mono text-xs" : ""}`}>{item.label}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{item.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BreakdownList({
  items, empty, accent = "primary",
}: {
  items: { label: string; count: number }[]; empty: string; accent?: "primary" | "emerald";
}) {
  const total = items.reduce((s, i) => s + i.count, 0);
  const bar = accent === "emerald" ? "bg-emerald-500" : "bg-primary";

  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 8).map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate font-medium">{item.label || "Unknown"}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{item.count.toLocaleString()} <span className="text-xs">({pct}%)</span></span>
            </div>
            <div className="h-1.5 rounded-full bg-muted" aria-hidden>
              <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
