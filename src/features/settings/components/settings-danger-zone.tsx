"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function SettingsDangerZone() {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="border-b border-destructive/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
        <CardDescription>
          These actions are irreversible. Please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Delete Account</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently remove your account and all associated data.
          </p>
        </div>
        <Button variant="destructive" size="sm" disabled>
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
