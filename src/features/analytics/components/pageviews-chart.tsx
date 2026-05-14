"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { DailyStatPoint } from "@/features/analytics/services/analytics.service";

interface PageViewsChartProps {
  data: DailyStatPoint[];
}

export function PageViewsChart({ data }: PageViewsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="glass shadow-xl border-white/20">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Traffic Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">
            No data available yet. Analytics will appear as visitors arrive.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass shadow-xl border-white/20">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Traffic Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[300px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="oklch(var(--border))"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
                dy={10}
                tickFormatter={(v: string) => {
                  const d = new Date(v + "T00:00:00");
                  return d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(var(--card))",
                  borderColor: "oklch(var(--border))",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.15)",
                  fontSize: "12px",
                }}
                labelFormatter={(label: string) =>
                  new Date(label + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="pageviews"
                name="Pageviews"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="oklch(0.7 0.18 163)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                strokeDasharray="5 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
