"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DangerZoneSection() {
  const [confirm, setConfirm] = useState("");

  return (
    <Card className="relative hover:border-destructive/40 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-destructive/5 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-destructive/80 uppercase block">{"// warning: irreversible operations"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-destructive block">Danger Zone</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-mono text-xs uppercase text-white font-bold mb-1">Delete account</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">{"// This action is irreversible. All websites, analytics databases, and profiles will be deleted."}</p>
            <div className="mt-4 flex items-center space-x-2 w-96">
              <Input placeholder="Type DELETE to confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <Button variant="destructive" disabled={confirm !== "DELETE"} className="font-mono text-[10px] uppercase">DELETE_ACCOUNT</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
