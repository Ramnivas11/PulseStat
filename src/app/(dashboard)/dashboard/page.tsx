import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/services/website.service";
import {
  getBrowserStats,
  getDailyStats,
  getDashboardStats,
  getTopPages,
  getDeviceStats,
} from "@/services/analytics.service";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RealtimeCard } from "@/components/dashboard/realtime-card";
import { PageViewsChart } from "@/components/dashboard/pageviews-chart";
import { WebsiteCard } from "@/components/dashboard/website-card";
import { CreateWebsiteForm } from "@/components/dashboard/create-website-form";
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

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const websites = await getWebsitesByUserId(
    session.user.id
  );

  if (websites.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Create a website to start collecting analytics."
        />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <CreateWebsiteForm />

          <EmptyState
            title="No websites yet"
            description="Add a website to view its analytics dashboard."
          />
        </div>
      </div>
    );
  }

  const website = websites[0];

  const [stats, topPages, browsers, devices, dailyStats] =
    await Promise.all([
      getDashboardStats(website.id),
      getTopPages(website.id),
      getBrowserStats(website.id),
      getDeviceStats(website.id),
      getDailyStats(website.id),
    ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Analytics overview for ${website.name}`}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <PageViewsChart data={dailyStats} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No page data available yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Path</TableHead>
                      <TableHead className="text-right">
                        Views
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.map((page) => (
                      <TableRow key={page.path}>
                        <TableCell>{page.path}</TableCell>
                        <TableCell className="text-right">
                          {page.views.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {browsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No browser analytics yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {browsers.map((browser) => (
                    <div
                      key={browser.browser}
                      className="flex items-center justify-between"
                    >
                      <span>{browser.browser}</span>
                      <span className="font-semibold">
                        {browser.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No device analytics yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {devices.map((device) => (
                    <div
                      key={device.device}
                      className="flex items-center justify-between"
                    >
                      <span>{device.device}</span>
                      <span className="font-semibold">
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

      <div className="grid gap-6 md:grid-cols-2">
        <WebsiteCard
          name={website.name}
          domain={website.domain}
          siteKey={website.siteKey}
        />
      </div>
    </div>
  );
}
