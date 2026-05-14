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
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <CardContent className="flex flex-col items-center p-6 text-center sm:flex-row sm:text-left sm:p-8 gap-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-400">
            {title}
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-500/80">
            {description}
          </p>
        </div>
        <Link
          href="/billing"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-amber-600 px-6 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          Upgrade to Pro
        </Link>
      </CardContent>
    </Card>
  );
}
