"use client";

import { useEffect } from "react";

/**
 * Progressive scroll-reveal: flags `.rv` elements with `.in` as they enter the
 * viewport. CSS owns the transition and gates it behind
 * `prefers-reduced-motion: no-preference`, so without JS (or with reduced
 * motion) everything is simply visible.
 */
export default function Reveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (elements.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in"));
      return;
    }
    document.documentElement.classList.add("js-rv");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
