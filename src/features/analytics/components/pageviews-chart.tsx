"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DailyStatPoint } from "@/features/analytics/services/analytics.service";

interface PageViewsChartProps {
  data: DailyStatPoint[];
}

export function PageViewsChart({ data }: PageViewsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="font-heading text-base font-semibold tracking-tight text-foreground">Traffic Trend</div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No daily analytics are available yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <CardHeader className="border-b border-border bg-muted/10 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// traffic analytics"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground block">Traffic Trend</span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} 
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                  boxShadow: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--foreground)"
                }}
              />
              <Line
                type="monotone"
                dataKey="pageviews"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--primary)", strokeWidth: 1, stroke: "var(--background)" }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
