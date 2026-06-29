"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export default function GeneralSection() {
  const [user, setUser] = useState<{ id?: string; email?: string; name?: string; createdAt?: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async function load() {
      const res = await apiGet<{ ok: boolean; data: { id?: string; email?: string; name?: string; createdAt?: string } }>("/api/settings/profile");
      if (!mounted) return;
      if (res.ok && res.data?.ok) {
        const d = res.data.data;
        setUser(d);
        setName(d?.name ?? "");
        setEmail(d?.email ?? "");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setIsSaving(true);
    try {
      const res = await apiPatch<{ ok: boolean; data: { id?: string; email?: string; name?: string; createdAt?: string } }>("/api/settings/profile", { name, email });
      if (res.ok) {
        if (res.data?.ok) {
          setUser(res.data.data);
          setEditing(false);
        } else {
          console.error("Failed to save profile: API error");
        }
      } else {
        console.error("Failed to save profile:", res.error);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="relative rounded-none border-sharp bg-black hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-muted/10 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// general settings"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground block">Account Details</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{"// Account Profile"}</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                {!editing ? (
                  <>
                    <div className="text-sm font-semibold text-foreground">{user?.name ?? "Unknown"}</div>
                    <div className="font-mono text-xs text-muted-foreground">{user?.email ?? "-"}</div>
                  </>
                ) : (
                  <div className="space-y-2 w-80">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
                  </div>
                )}
              </div>
              <span className="font-mono text-[9px] border border-border bg-muted/20 px-2 py-0.5 text-muted-foreground">MEMBER</span>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{"// Account created"}</div>
            <div className="mt-1.5 font-mono text-xs text-foreground">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</div>
          </div>

          <div className="flex space-x-2 pt-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)} size="sm" variant="outline" className="font-mono text-[10px] uppercase">EDIT_PROFILE</Button>
            ) : (
              <>
                <Button onClick={save} disabled={isSaving} size="sm" className="font-mono text-[10px] uppercase">{isSaving ? "SAVING..." : "SAVE_CHANGES"}</Button>
                <Button variant="ghost" onClick={() => setEditing(false)} size="sm" className="font-mono text-[10px] uppercase">CANCEL</Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
