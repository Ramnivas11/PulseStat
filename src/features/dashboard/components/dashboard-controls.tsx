"use client";

import { RefreshButton } from "@/features/dashboard/components/refresh-button";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { WebsiteSelector } from "@/features/websites/components/website-selector";

import type { Website } from "@prisma/client";

interface DashboardControlsProps {
  websites: Pick<Website, "id" | "name" | "domain">[];
}

export function DashboardControls({ websites }: DashboardControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <RefreshButton />
      <DateRangeSelector />
      <WebsiteSelector websites={websites} />
    </div>
  );
}
