"use client";

import { useEffect, useState } from "react";

import { Lockup } from "@/components/Brand";
import { BRAND_NAME } from "@/lib/config";

type NavProps = {
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Hidden behind the cover screen, then a --bone ground with a hairline bottom border
 * once the page has scrolled past it. The cover already carries the mark and the
 * name, so showing the nav over it would only repeat them.
 *
 * One page, so no hamburger: the phone gets the wordmark and the questionnaire link.
 */
export function Nav({ ctaHref, ctaLabel }: NavProps) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setSettled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-print-hide
      data-settled={settled ? "true" : "false"}
      aria-hidden={settled ? undefined : true}
      className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${
        settled
          ? "border-b border-rule bg-bone opacity-100"
          : "pointer-events-none border-b border-transparent bg-transparent opacity-0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="shell flex h-20 items-center justify-between gap-6"
      >
        <a
          href="#top"
          aria-label={`${BRAND_NAME} — back to the top`}
          className="shrink-0"
        >
          <Lockup variant="inline" />
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
            <a href={ctaHref} className="t-eyebrow link">
              {ctaLabel}
            </a>
          </li>
        </ul>

        {/* The same link, not a second one: the list above is hidden on a phone. */}
        <a href={ctaHref} className="t-eyebrow link md:hidden">
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}
