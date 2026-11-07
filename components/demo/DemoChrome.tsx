"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ToranaMark } from "@/components/Brand";
import { SAMPLE_DATA_LABEL } from "@/lib/demo-data";

/**
 * Her navigation. Five destinations, text only — nothing to learn, no icons to
 * decode. It appears once she is inside the programme; during onboarding there is
 * one thing on the screen and no way to wander off it.
 */
const TABS = [
  { href: "/demo/today", label: "Today" },
  { href: "/demo/plan", label: "Plan" },
  { href: "/demo/calendar", label: "Calendar" },
  { href: "/demo/markers", label: "Markers" },
  { href: "/demo/guide", label: "Guide" },
] as const;

/** Onboarding runs without the tab bar. */
const ONBOARDING = [
  "/demo",
  "/demo/consent",
  "/demo/survey",
  "/demo/journey",
  "/demo/book-call",
  "/demo/book-panel",
];

export function useIsOnboarding(): boolean {
  const pathname = usePathname();
  return ONBOARDING.includes(pathname);
}

export function DemoHeader({ title }: { title?: string }) {
  return (
    <header className="demo-gutter flex flex-none items-center justify-between gap-3 border-b border-rule py-3">
      <Link
        href="/demo/today"
        className="flex items-center gap-2"
        aria-label="Tora House"
      >
        <ToranaMark className="h-6 w-6 text-fg" compact />
        <span className="t-wordmark text-[0.6875rem] text-fg">Tora House</span>
      </Link>
      {title ? <span className="t-eyebrow">{title}</span> : null}
      <span className="demo-stamp">{SAMPLE_DATA_LABEL}</span>
    </header>
  );
}

export function DemoTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Member"
      className="flex flex-none items-stretch justify-between gap-0.5 border-t border-rule bg-bone px-2 pt-2 pb-3"
    >
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1.5 py-1"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-5 ${active ? "bg-brass" : "bg-transparent"}`}
            />
            <span
              className="t-eyebrow demo-tab text-[0.5625rem]"
              style={active ? { color: "var(--fg)" } : undefined}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
