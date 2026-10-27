"use client";

import { useEffect, useState } from "react";

import { BRAND_NAME } from "@/lib/config";

type NavProps = {
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Transparent over the hero, then a --bone ground with a hairline bottom border
 * once the page has scrolled past 80vh. One page, so no hamburger: the phone gets
 * the wordmark and a single Apply link.
 */
export function Nav({ ctaHref, ctaLabel }: NavProps) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-print-hide
      data-settled={settled ? "true" : "false"}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        settled ? "border-b border-rule bg-bone" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-20 items-center justify-between gap-6">
        <a href="#top" className="link-quiet font-display text-xl tracking-tight">
          {BRAND_NAME}
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <a href="#method" className="t-eyebrow link-quiet">
              The Method
            </a>
          </li>
          <li>
            <a href="#room" className="t-eyebrow link-quiet">
              The Room
            </a>
          </li>
          <li>
            <a href={ctaHref} className="t-eyebrow link-quiet">
              {ctaLabel}
            </a>
          </li>
        </ul>

        <a href={ctaHref} className="t-eyebrow link">
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}
