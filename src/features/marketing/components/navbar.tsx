"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-primary/10 border border-primary/30 p-1.5 rounded-none text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-white">PulseStat</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-wider">
          <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
            {"// features"}
          </Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            {"// process"}
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
            {"// pricing"}
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
            {"// documentation"}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
            login
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="font-mono text-xs uppercase px-4 rounded-none">
              {"dashboard // enter"}
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground border border-border rounded-none bg-muted/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-border py-4 px-4 flex flex-col gap-4">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-muted/40 rounded-none text-muted-foreground hover:text-white">
            {"// features"}
          </Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-muted/40 rounded-none text-muted-foreground hover:text-white">
            {"// process"}
          </Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-muted/40 rounded-none text-muted-foreground hover:text-white">
            {"// pricing"}
          </Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-muted/40 rounded-none text-muted-foreground hover:text-white">
            {"// documentation"}
          </Link>
          <hr className="border-border my-1" />
          <div className="flex flex-col gap-2 px-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center rounded-none font-mono text-xs uppercase">
                login
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center rounded-none font-mono text-xs uppercase">
                dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
