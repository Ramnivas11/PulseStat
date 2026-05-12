"use client";

import { useSession } from "next-auth/react";
import {
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        <h1 className="text-lg font-semibold">
          PulseStat
        </h1>
      </div>
        <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {session?.user?.email}
        </p>
      </div>

       <button
          onClick={() => signOut()}
          className="text-sm font-medium text-red-500 hover:text-red-600"
        >
          Logout
        </button>

      <ThemeToggle />
    </header>
  );
}