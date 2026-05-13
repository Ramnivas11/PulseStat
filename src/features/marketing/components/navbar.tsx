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
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">PulseStat</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="rounded-full px-5">
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg py-4 px-4 flex flex-col gap-4">
          <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
            Features
          </Link>
          <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
            How it works
          </Link>
          <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
            Pricing
          </Link>
          <Link href="/docs" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md">
            Docs
          </Link>
          <hr className="my-2" />
          <div className="flex flex-col gap-2 px-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
