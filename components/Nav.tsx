"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Lockup } from "@/components/Brand";
import { BRAND_NAME } from "@/lib/config";

type NavProps = {
  ctaHref: string;
  ctaLabel: string;
  /**
   * The third item. While an immersion is on it takes Demo's place, which keeps
   * the nav at five; once the event has run, Demo comes back.
   */
  slot: { href: string; label: string };
};

/**
 * Hidden behind the cover screen, then a --bone ground with a hairline bottom border
 * once the page has scrolled past it. The cover already carries the mark and the
 * name, so showing the nav over it would only repeat them.
 *
 * One page, so no hamburger: the phone gets the wordmark and the one action link.
 */
export function Nav({ ctaHref, ctaLabel, slot }: NavProps) {
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

        {/* gap-5 on a tablet: "Immersion" and "Reserve a seat" are longer than
            the items they stand in for, and at 768px the list would otherwise
            wrap. nowrap so a label never breaks in two. */}
        <ul className="hidden items-center gap-5 whitespace-nowrap md:flex lg:gap-10">
          <li>
            {/* The only link here that leaves the page, so it is a Link. */}
            <Link href="/about" className="t-eyebrow link-quiet">
              About
            </Link>
          </li>
          <li>
            <a href="#method" className="t-eyebrow link-quiet">
              The Method
            </a>
          </li>
          <li>
            <a href={slot.href} className="t-eyebrow link-quiet">
              {slot.label}
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
