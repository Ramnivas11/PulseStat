"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RealtimeCardProps {
  websiteId: string;
}

export function RealtimeCard({
  websiteId,
}: RealtimeCardProps) {
  const [activeVisitors, setActiveVisitors] =
    useState(0);

  useEffect(() => {
    async function fetchRealtime() {
      const res = await fetch(
        `/api/realtime/${websiteId}`
      );

      const data = await res.json();

      setActiveVisitors(
        data.activeVisitors
      );
    }

    fetchRealtime();

    const interval = setInterval(
      fetchRealtime,
      10000
    );

    return () =>
      clearInterval(interval);
  }, [websiteId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Visitors</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-5xl font-bold">
          {activeVisitors}
        </p>
      </CardContent>
    </Card>
  );
}