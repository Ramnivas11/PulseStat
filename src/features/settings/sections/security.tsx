"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SecuritySection() {
  return (
    <Card className="relative hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="border-b border-border bg-muted/10 pb-4">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase block">{"// security credentials"}</span>
          <span className="font-heading text-base font-semibold tracking-tight text-foreground block">Security</span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase text-foreground font-bold mb-1">Password</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">{"// Change your password profile security key."}</p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="font-mono text-[10px] uppercase">CHANGE_PASSWORD</Button>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase text-foreground font-bold mb-1">Active Sessions</h4>
            <p className="font-mono text-[10px] text-muted-foreground uppercase leading-relaxed">{"// Manage active terminal connections on other devices."}</p>
            <div className="mt-3">
              <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase text-muted-foreground hover:text-foreground">SIGN_OUT_OTHER_SESSIONS</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
