import { redirect } from "next/navigation";
import { BarChart3, Eye, Globe2, MousePointerClick, Users, type LucideIcon } from "lucide-react";

import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/features/websites/services/website.service";
import {
  getBrowserStats,
  getDailyStats,
  getDashboardStats,
  getDeviceStats,
  getTopPages,
} from "@/features/analytics/services/analytics.service";
import { getAnalyticsDateRange, normalizeAnalyticsRange } from "@/features/analytics/services/date-range";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { RealtimeCard } from "@/features/realtime/components/realtime-card";
import { PageViewsChart } from "@/features/analytics/components/pageviews-chart";
import { WebsiteSelector } from "@/features/websites/components/website-selector";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { WebsiteCard } from "@/features/websites/components/website-card";
import { GettingStarted } from "@/features/dashboard/components/getting-started";
import { UsageOverview } from "@/features/billing/components/usage-overview";
import { RefreshButton } from "@/features/dashboard/components/refresh-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { canCreateWebsite } from "@/features/billing/services/billing.service";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

export const metadata = {
  title: "Dashboard",
  description: "Realtime website analytics and audience insights.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const requestedSiteId = typeof searchParams.siteId === "string" ? searchParams.siteId : null;
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
        <PageHeader title="Dashboard" description="Create a website to start collecting privacy-friendly analytics." />
        <div className="mx-auto mt-8 max-w-3xl">
          {permission.allowed ? (
            <GettingStarted />
          ) : (
            <UpgradePrompt
              title="Website limit reached"
              description={`You are using ${permission.currentCount}/${permission.limit} websites on the ${permission.plan} plan. Upgrade to Pro for unlimited websites.`}
            />
          )}
        </div>
      </div>
    );
  }

  const website = requestedSiteId ? websites.find((w) => w.id === requestedSiteId) ?? websites[0] : websites[0];

  const [stats, topPages, browsers, devices, dailyStats] = await Promise.all([
    getDashboardStats(website.id, startDate, endDate),
    getTopPages(website.id, startDate, endDate),
    getBrowserStats(website.id, startDate, endDate),
    getDeviceStats(website.id, startDate, endDate),
    getDailyStats(website.id, startDate, endDate),
  ]);

  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-3xl border bg-[radial-gradient(circle_at_top_left,theme(colors.blue.500/0.18),transparent_34%),linear-gradient(135deg,theme(colors.background),theme(colors.muted/0.6))] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Realtime analytics active
            </div>
            <PageHeader title={website.name} description={`Analytics overview for ${website.domain}`} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
            <RefreshButton />
            <DateRangeSelector />
            <WebsiteSelector websites={websites} />
          </div>
        </div>
      </section>

      <UsageOverview />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Pageviews" value={stats.pageviews.toLocaleString()} icon={Eye} description="Total page load events" />
        <StatsCard title="Visitors" value={stats.visitors.toLocaleString()} icon={Users} description="Unique visitors in range" />
        <StatsCard title="Sessions" value={stats.sessions.toLocaleString()} icon={MousePointerClick} description="Unique browsing sessions" />
        <RealtimeCard websiteId={website.id} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <PageViewsChart data={dailyStats} />

        <div className="space-y-6">
          <Card className="glass overflow-hidden shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                Top pages
              </CardTitle>
              <CardDescription>Most viewed paths for the selected range.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {topPages.length === 0 ? (
                <EmptyPanel icon={Globe2} title="No page data yet" description="Install the tracking snippet and pageviews will appear here in realtime." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="min-w-48 font-medium">Path</TableHead>
                        <TableHead className="text-right font-medium">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPages.map((page) => (
                        <TableRow key={page.path}>
                          <TableCell className="max-w-72 truncate font-mono text-xs sm:text-sm">{page.path}</TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">{page.views.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <BreakdownCard title="Browser breakdown" items={browsers.map((item) => ({ label: item.browser, count: item.count }))} empty="No browser analytics yet." />
          <BreakdownCard title="Device breakdown" items={devices.map((item) => ({ label: item.device, count: item.count }))} empty="No device analytics yet." accent="emerald" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <WebsiteCard name={website.name} domain={website.domain} siteKey={website.siteKey} />
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  items,
  empty,
  accent = "primary",
}: {
  title: string;
  items: { label: string; count: number }[];
  empty: string;
  accent?: "primary" | "emerald";
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const badgeClass = accent === "emerald" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary";

  return (
    <Card className="glass shadow-sm">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{empty}</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">{item.label}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-bold tabular-nums ${badgeClass}`}>{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <div className={`h-full rounded-full ${accent === "emerald" ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyPanel({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
