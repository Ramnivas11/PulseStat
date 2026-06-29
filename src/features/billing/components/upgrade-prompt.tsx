"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UpgradePromptProps {
  title: string;
  description: string;
}

export function UpgradePrompt({ title, description }: UpgradePromptProps) {
  return (
    <Card className="rounded-none border border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center p-6 text-center sm:flex-row sm:text-left sm:p-8 gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-primary/20 text-primary border border-primary/30">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-heading font-black uppercase tracking-tight text-white">
            {title}
          </h3>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            {"// " + description}
          </p>
        </div>
        <Link
          href="/billing"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-none bg-primary px-6 text-xs font-mono uppercase tracking-wider font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-0"
        >
          Upgrade to Pro
        </Link>
      </CardContent>
    </Card>
  );
}
