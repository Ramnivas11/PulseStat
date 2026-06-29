"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: ReactNode;
  range?: number;
  speed?: number;
  className?: string;
}

export function Magnetic({ children, range = 0.35, speed = 0.3, className }: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply on devices that support hover (responsive protection)
    const isHoverSupported = window.matchMedia("(hover: hover)").matches;
    if (!isHoverSupported) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(container, {
        x: x * range,
        y: y * range,
        duration: speed,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, speed]);

  return (
    <div ref={containerRef} className={`inline-block ${className || ""}`}>
      {children}
    </div>
  );
}
