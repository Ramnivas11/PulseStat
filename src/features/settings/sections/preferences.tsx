"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function PreferencesSection() {
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function load() {
      const res = await apiGet<{ ok: boolean; data: { theme?: string; compact?: boolean } }>("/api/settings/preferences");
      if (!mounted) return;
      if (res.ok && res.data?.ok) {
        const d = res.data.data;
        setDark(Boolean(d?.theme === "dark"));
        setCompact(Boolean(d?.compact));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setIsSaving(true);
    try {
      const body = { theme: dark ? "dark" : "light", compact };
      const res = await apiPatch("/api/settings/preferences", body);
      if (!res.ok) {
        console.error("Failed to save preferences", res.error);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="relative rounded-none border-sharp bg-black hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-muted/10 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// system settings"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground block">Preferences</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <div className="font-mono text-xs uppercase text-foreground font-bold mb-1">Dark Mode</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">{"// Force dark theme environment."}</div>
            </div>
            <input 
              type="checkbox" 
              checked={dark} 
              onChange={(e) => setDark(e.target.checked)} 
              className="accent-primary border-border bg-card rounded-none size-4 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <div className="font-mono text-xs uppercase text-foreground font-bold mb-1">Compact Mode</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase">{"// Reduce table cell padding."}</div>
            </div>
            <input 
              type="checkbox" 
              checked={compact} 
              onChange={(e) => setCompact(e.target.checked)} 
              className="accent-primary border-border bg-card rounded-none size-4 focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="pt-2">
            <Button onClick={save} disabled={isSaving} size="sm" className="font-mono text-[10px] uppercase">
              {isSaving ? "SAVING..." : "SAVE_PREFERENCES"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
