import { notFound, redirect } from "next/navigation";
import { formatDuration } from "@/lib/utils";
import {
  BarChart3, Eye, Users, MousePointerClick, ArrowUpRight,
  Link2, Monitor, Globe2, Clock, Zap, type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getBrowserStats, getCountryStats, getDailyStats, getDashboardStats,
  getDeviceStats, getLanguageStats, getOSStats, getReferrerStats, getTopPages,
  getAvgSessionDuration, getCustomEvents, getUTMStats,
} from "@/features/analytics/services/analytics.service";
import { getAnalyticsDateRange, normalizeAnalyticsRange } from "@/features/analytics/services/date-range";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { PageViewsChart } from "@/features/analytics/components/pageviews-chart";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { RefreshButton } from "@/features/dashboard/components/refresh-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(props: Props) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Analytics" };

  const website = await prisma.website.findFirst({
    where: { id, userId: session.user.id },
    select: { name: true },
  });

  return { title: website ? `${website.name} — Analytics` : "Analytics" };
}

export default async function WebsiteAnalyticsPage(props: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const range = normalizeAnalyticsRange(typeof searchParams.range === "string" ? searchParams.range : undefined);
  const { startDate, endDate } = getAnalyticsDateRange(range);

  const website = await prisma.website.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, name: true, domain: true, siteKey: true },
  });

  if (!website) notFound();

  const [stats, topPages, browsers, devices, dailyStats, osStats, countries, referrers, languages, avgDuration, customEvents, utmSources, utmMediums, utmCampaigns] = await Promise.all([
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
    getCustomEvents(website.id, startDate, endDate),
    getUTMStats(website.id, "utmSource", startDate, endDate),
    getUTMStats(website.id, "utmMedium", startDate, endDate),
    getUTMStats(website.id, "utmCampaign", startDate, endDate),
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header bar */}
      <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,theme(colors.blue.500/0.18),transparent_34%),linear-gradient(135deg,theme(colors.background),theme(colors.muted/0.6))] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              <Link href="/websites" className="hover:underline">Websites</Link>
              {" / "}
              <span>{website.domain}</span>
            </p>
            <PageHeader title={website.name} description={`pulsestat.io · ${website.domain}`} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RefreshButton />
            <DateRangeSelector />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/websites/${website.id}/settings`}>Settings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Pageviews"    value={stats.pageviews.toLocaleString()}  icon={Eye}              description="Total page loads" />
        <StatsCard title="Visitors"     value={stats.visitors.toLocaleString()}   icon={Users}            description="Unique visitors" />
        <StatsCard title="Sessions"     value={stats.sessions.toLocaleString()}   icon={MousePointerClick} description="Browsing sessions" />
        <StatsCard title="Bounce Rate"  value={`${stats.bounceRate}%`}            icon={ArrowUpRight}     description="Single-page visits" />
        <StatsCard title="Avg. Duration" value={formatDuration(avgDuration)}      icon={Clock}            description="Avg. session length" />
      </div>

      {/* Traffic chart + Top Pages */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <PageViewsChart data={dailyStats} />

        <Card className="glass overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Pages
            </CardTitle>
            <CardDescription>Most visited paths in the selected range.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {topPages.length === 0 ? (
              <EmptyBox icon={Globe2} text="No page data yet." />
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
                    {topPages.map((p) => (
                      <TableRow key={p.path}>
                        <TableCell className="max-w-64 truncate font-mono text-xs">{p.path}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{p.views.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sources + Environment breakdown — tabbed like Umami */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownCard
          title="Sources"
          icon={Link2}
          description="Where visitors come from."
          tabs={[
            { id: "referrers", label: "Referrers", items: referrers.map((r) => ({ label: r.label || "Direct / None", count: r.count })) },
            { id: "countries", label: "Countries", items: countries.map((c) => ({ label: c.label, count: c.count })) },
            { id: "languages", label: "Languages", items: languages.map((l) => ({ label: l.label, count: l.count })) },
          ]}
        />

        <BreakdownCard
          title="Environment"
          icon={Monitor}
          description="Browser, OS, and device."
          tabs={[
            { id: "browsers", label: "Browsers", items: browsers.map((b) => ({ label: b.browser, count: b.count })) },
            { id: "os",       label: "OS",       items: osStats.map((o) => ({ label: o.label,   count: o.count })) },
            { id: "devices",  label: "Devices",  items: devices.map((d) => ({ label: d.device,  count: d.count })), accent: "emerald" as const },
          ]}
        />

      {/* Custom Events — Umami Events panel */}
      {customEvents.length > 0 && (
        <BreakdownCard
          title="Custom Events"
          icon={Zap}
          description="Events tracked via window.pulsestat.track()"
          tabs={[
            { id: "events", label: "Events", items: customEvents },
          ]}
        />
      )}

      {/* UTM Attribution — only shown when UTM data exists */}
      {(utmSources.length > 0 || utmMediums.length > 0 || utmCampaigns.length > 0) && (
        <BreakdownCard
          title="UTM Attribution"
          icon={ArrowUpRight}
          description="Traffic from UTM-tagged campaigns."
          tabs={[
            { id: "source",   label: "Source",   items: utmSources.map((u) => ({ label: u.label, count: u.count })) },
            { id: "medium",   label: "Medium",   items: utmMediums.map((u) => ({ label: u.label, count: u.count })) },
            { id: "campaign", label: "Campaign", items: utmCampaigns.map((u) => ({ label: u.label, count: u.count })) },
          ]}
        />
      )}
      </div>
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function EmptyBox({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
      <Icon className="h-8 w-8 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function BreakdownCard({
  title, icon: Icon, description, tabs,
}: {
  title: string; icon: LucideIcon; description: string;
  tabs: { id: string; label: string; items: { label: string; count: number }[]; accent?: "primary" | "emerald" }[];
}) {
  return (
    <Card className="glass shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue={tabs[0]?.id}>
          <TabsList className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <ProgressList items={tab.items} accent={tab.accent} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ProgressList({
  items, accent = "primary",
}: {
  items: { label: string; count: number }[]; accent?: "primary" | "emerald";
}) {
  const total = items.reduce((s, i) => s + i.count, 0);
  const barClass = accent === "emerald" ? "bg-emerald-500" : "bg-primary";

  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No data for this period.</p>;
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 8).map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate font-medium">{item.label || "Unknown"}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {item.count.toLocaleString()} <span className="text-xs">({pct}%)</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted" aria-hidden>
              <div className={`h-full rounded-full ${barClass} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
