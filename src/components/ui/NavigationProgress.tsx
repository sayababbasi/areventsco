"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, route change has completed
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks across the entire application
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only handle internal navigation links
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsNavigating(true);
          setProgress(25);

          // Smooth micro-advance in <600ms
          const p1 = setTimeout(() => setProgress(65), 120);
          const p2 = setTimeout(() => setProgress(88), 280);

          // Safety auto-complete max 800ms (not more than 1 second)
          const p3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
              setIsNavigating(false);
              setProgress(0);
            }, 200);
          }, 800);

          return () => {
            clearTimeout(p1);
            clearTimeout(p2);
            clearTimeout(p3);
          };
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isNavigating || progress > 0 ? 1 : 0 }}
    >
      {/* Luxury Gold Progress Bar */}
      <div
        className="h-[3px] bg-gradient-to-r from-brand-gold-600 via-brand-gold-400 to-brand-gold-300 transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "300ms",
          boxShadow: "0 0 12px rgba(212, 175, 55, 0.8), 0 0 4px rgba(212, 175, 55, 1)",
        }}
      />
      {/* Subtle Right Edge Glow Head */}
      <div
        className="absolute top-0 right-0 w-24 h-[3px] bg-white opacity-60 blur-[2px]"
        style={{
          transform: `translateX(-${100 - progress}%)`,
        }}
      />
    </div>
  );
}
