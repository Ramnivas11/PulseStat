import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { RefreshButton } from "@/features/dashboard/components/refresh-button";

import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/features/websites/services/website.service";
import {
  getBrowserStats,
  getDailyStats,
  getDashboardStats,
  getTopPages,
  getDeviceStats,
} from "@/features/analytics/services/analytics.service";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatsCard } from "@/features/analytics/components/stats-card";
import { RealtimeCard } from "@/features/realtime/components/realtime-card";
import { PageViewsChart } from "@/features/analytics/components/pageviews-chart";
import { WebsiteSelector } from "@/features/websites/components/website-selector";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { WebsiteCard } from "@/features/websites/components/website-card";
import { GettingStarted } from "@/features/dashboard/components/getting-started";
import { UsageOverview } from "@/features/billing/components/usage-overview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canCreateWebsite } from "@/features/billing/services/billing.service";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage(props: Props) {
  const searchParams = await props.searchParams;
  const requestedSiteId = typeof searchParams.siteId === "string" ? searchParams.siteId : null;
  const range = typeof searchParams.range === "string" ? searchParams.range : "all";

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (range === "7d") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    endDate = new Date();
  } else if (range === "30d") {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    endDate = new Date();
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const websites = await getWebsitesByUserId(
    session.user.id
  );

  const permission = await canCreateWebsite(session.user.id);

  if (websites.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Create a website to start collecting analytics."
        />

        <div className="mx-auto max-w-3xl mt-8">
          {permission.allowed ? (
            <GettingStarted />
          ) : (
            <UpgradePrompt 
              title="Website Limit Reached" 
              description={`You are using ${permission.currentCount}/${permission.limit} websites on the ${permission.plan} plan. Upgrade to Pro for unlimited websites.`} 
            />
          )}
        </div>
      </div>
    );
  }

  const website = requestedSiteId 
    ? websites.find((w) => w.id === requestedSiteId) || websites[0] 
    : websites[0];

  const [stats, topPages, browsers, devices, dailyStats] =
    await Promise.all([
      getDashboardStats(website.id, startDate, endDate),
      getTopPages(website.id), // Top pages handles all-time for now due to aggregated model
      getBrowserStats(website.id, startDate, endDate),
      getDeviceStats(website.id, startDate, endDate),
      getDailyStats(website.id, startDate, endDate),
    ]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Dashboard"
          description={`Analytics overview for ${website.name}`}
        />
        <div className="flex flex-wrap items-center gap-3">
          <RefreshButton />
          <DateRangeSelector />
          <WebsiteSelector websites={websites} />
        </div>
      </div>

      <UsageOverview />

      {stats.pageviews === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Waiting for data..."
            description="Install the tracking snippet on your website and visit your pages. Data will appear here automatically."
          />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Pageviews"
              value={stats.pageviews.toLocaleString()}
            />

            <StatsCard
              title="Visitors"
              value={stats.visitors.toLocaleString()}
            />

            <StatsCard
              title="Sessions"
              value={stats.sessions.toLocaleString()}
            />

            <RealtimeCard websiteId={website.id} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            <PageViewsChart data={dailyStats} />

            <div className="space-y-8">
              <Card className="glass overflow-hidden shadow-lg border-white/20">
                <CardHeader className="border-b bg-muted/30 pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {topPages.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No page data available yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="w-full font-medium">Path</TableHead>
                            <TableHead className="text-right font-medium">Views</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topPages.map((page) => (
                            <TableRow key={page.path} className="hover:bg-muted/20 transition-colors">
                              <TableCell className="font-medium max-w-[200px] truncate">{page.path}</TableCell>
                              <TableCell className="text-right tabular-nums">
                                {page.views.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass shadow-lg border-white/20">
                <CardHeader className="border-b bg-muted/30 pb-4">
                  <CardTitle className="text-lg font-semibold">Browser Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {browsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No browser analytics yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {browsers.map((browser) => (
                        <div
                          key={browser.browser}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{browser.browser}</span>
                          <span className="font-bold tabular-nums text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {browser.count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass shadow-lg border-white/20">
                <CardHeader className="border-b bg-muted/30 pb-4">
                  <CardTitle className="text-lg font-semibold">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {devices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No device analytics yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {devices.map((device) => (
                        <div
                          key={device.device}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{device.device}</span>
                          <span className="font-bold tabular-nums text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {device.count.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <WebsiteCard
          name={website.name}
          domain={website.domain}
          siteKey={website.siteKey}
        />
      </div>
    </div>
  );
}
