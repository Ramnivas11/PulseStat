"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Settings,
  CreditCard,
  BarChart3,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Websites", href: "/websites", icon: Globe },
  { name: "Docs", href: "/docs", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-card/50 backdrop-blur-xl overflow-y-auto">
      <div className="p-6 lg:p-8 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-blue-500/20">
            <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6" />
          </div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            PulseStat
          </h2>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 lg:px-4" aria-label="Main navigation">
        <div className="px-3 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Main Menu
          </p>
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground/70 group-hover:text-primary"
                  )}
                />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 lg:p-4 mt-auto shrink-0">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-4 lg:p-6 text-white shadow-xl shadow-blue-500/10">
          <p className="text-sm font-bold opacity-90 mb-1">PulseStat Pro</p>
          <p className="text-xs opacity-75 mb-3">
            Unlimited websites and priority support.
          </p>
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
