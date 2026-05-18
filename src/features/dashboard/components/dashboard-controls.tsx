"use client";

import { RefreshButton } from "@/features/dashboard/components/refresh-button";
import { DateRangeSelector } from "@/features/analytics/components/date-range-selector";
import { WebsiteSelector } from "@/features/websites/components/website-selector";

interface WebsiteOption {
  id: string;
  name: string;
  domain: string;
}

interface DashboardControlsProps {
  websites: WebsiteOption[];
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
