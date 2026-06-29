"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Website } from "@prisma/client";

interface WebsiteSelectorProps {
  websites: Pick<Website, "id" | "name" | "domain">[];
}

export function WebsiteSelector({ websites }: WebsiteSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSiteId = searchParams.get("siteId") || websites[0]?.id;

  const handleValueChange = (siteId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("siteId", siteId);
    router.push(`/dashboard?${params.toString()}`);
  };

  if (websites.length <= 1) {
    return null; // No need to show selector if only 1 website
  }

  return (
    <Select value={currentSiteId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] rounded-none border-border bg-black font-mono text-[10px] uppercase tracking-widest text-white hover:border-primary/50 transition-colors h-10">
        <SelectValue placeholder="Select a website" />
      </SelectTrigger>
      <SelectContent>
        {websites.map((site) => (
          <SelectItem key={site.id} value={site.id}>
            {site.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
