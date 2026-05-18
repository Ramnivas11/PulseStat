"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface WebsiteOption {
  id: string;
  name: string;
  domain: string;
}

interface WebsiteSelectorProps {
  websites: WebsiteOption[];
}

export function WebsiteSelector({ websites }: WebsiteSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSiteId = searchParams.get("siteId") || websites[0]?.id || "";

  const handleValueChange = (siteId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("siteId", siteId);
    router.push(`/dashboard?${params.toString()}`);
  };

  if (websites.length === 0) return null;

  if (websites.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 text-sm font-medium text-muted-foreground">
        <span className="truncate max-w-[180px]">{websites[0]?.domain}</span>
      </div>
    );
  }

  return (
    <Select value={currentSiteId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select website" />
      </SelectTrigger>
      <SelectContent>
        {websites.map((site) => (
          <SelectItem key={site.id} value={site.id}>
            <span className="flex flex-col">
              <span>{site.name}</span>
              <span className="text-xs text-muted-foreground">{site.domain}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
