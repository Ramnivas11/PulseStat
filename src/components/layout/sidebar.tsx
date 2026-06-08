"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  CreditCard, 
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Websites",
    href: "/websites",
    icon: Globe,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-black border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]">
          <div className="bg-primary/10 border border-primary/30 p-1.5 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-heading font-bold tracking-tight text-white">
              PulseStat
            </h2>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              TELEMETRY_LOG
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <div className="px-3 mb-3">
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40 uppercase">
            {"// navigation"}
          </p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-150 border-l border-transparent",
                isActive 
                  ? "bg-muted/40 text-primary border-l-2 border-primary font-bold" 
                  : "text-muted-foreground hover:bg-muted/20 hover:text-foreground hover:border-l hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground")} />
                <span className="font-mono uppercase text-[10px]">{item.name}</span>
              </div>
              {isActive && <span className="font-mono text-[9px] text-primary/70">{"// OK"}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="border border-border p-4 bg-muted/10">
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-primary font-bold">
            <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
            <span>SYS_PREMIUM_LINK</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed mb-4">
            STATUS: ACTIVE_NODE<br/>
            UPGRADE: RECOMMENDED
          </p>
          <Link href="/billing">
            <Button variant="outline" size="sm" className="w-full text-[10px] font-mono font-bold tracking-tight">
              UPGRADE_TO_PRO
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
