"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  CreditCard, 
  BarChart3,
  ChevronRight
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-card/50 backdrop-blur-xl">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-blue-500/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            PulseStat
          </h2>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-4">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Main Menu
          </p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground/70 group-hover:text-primary")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-6 text-white shadow-xl shadow-blue-500/10">
          <p className="text-sm font-bold opacity-90 mb-1">PulseStat Pro</p>
          <p className="text-xs opacity-75 mb-4">Get unlimited websites and priority support.</p>
          <Link href="/billing">
            <button className="w-full rounded-lg bg-white/20 py-2 text-xs font-bold backdrop-blur-md transition-colors hover:bg-white/30">
              Upgrade Now
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
