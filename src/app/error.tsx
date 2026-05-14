"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { logError } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (logger strips sensitive info in production)
    logError(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <Card className="max-w-md w-full border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
        <CardContent className="flex flex-col items-center p-8 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-red-900 dark:text-red-400">
              Something went wrong
            </h3>
            <p className="text-sm text-red-700 dark:text-red-500/80">
              An unexpected error occurred while loading this page. Please try again.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
