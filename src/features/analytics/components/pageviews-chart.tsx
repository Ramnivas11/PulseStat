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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyStatPoint } from "@/features/analytics/services/analytics.service";

interface PageViewsChartProps {
  data: DailyStatPoint[];
}

export function PageViewsChart({ data }: PageViewsChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Trend</CardTitle>
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
    <Card className="glass shadow-xl border-white/20">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
          Traffic Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border))" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "oklch(var(--card))", 
                  borderColor: "oklch(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }}
              />
              <Line
                type="monotone"
                dataKey="pageviews"
                stroke="var(--primary)"
                strokeWidth={4}
                dot={{ r: 4, fill: "var(--primary)", strokeWidth: 2, stroke: "oklch(var(--background))" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
