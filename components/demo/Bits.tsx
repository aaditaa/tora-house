"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { DISCLAIMER, type MarkerStatus } from "@/lib/demo-data";

/** The standard screen: eyebrow, title, then whatever the screen is. */
export function Screen({
  eyebrow,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="demo-gutter flex min-h-full flex-col gap-6 py-7">
      {eyebrow || title ? (
        <div className="flex flex-col gap-3">
          {eyebrow ? (
            <>
              <hr className="rule-brass" />
              <p className="t-eyebrow">{eyebrow}</p>
            </>
          ) : null}
          {title ? <h1 className="t-h2">{title}</h1> : null}
          {lede ? <p className="t-body text-fg-muted">{lede}</p> : null}
        </div>
      ) : null}
      {children}
      {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
    </div>
  );
}

/** A full-width action. Never more than one primary per screen. */
export function Primary({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="btn btn-primary w-full">
      {children}
    </Link>
  );
}

export function Quiet({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="btn btn-quiet w-full">
      {children}
    </Link>
  );
}

/**
 * Three words, and never red. A reading is not a verdict, and a colour that says
 * "alarm" turns one into a verdict before anyone has read it with her.
 */
export function StatusChip({ status }: { status: MarkerStatus }) {
  if (!status) return null;
  const tone =
    status === "In range"
      ? ""
      : status === "Low"
        ? "demo-chip-low"
        : "demo-chip-watch";
  return <span className={`demo-chip ${tone}`}>{status}</span>;
}

/** The note that has to be in plain sight on consent, report, plan and the PDF. */
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="border-l border-brass pl-4">
      <p className={compact ? "t-meta text-fg-muted" : "t-body text-fg-muted"}>
        {DISCLAIMER}
      </p>
    </div>
  );
}

/**
 * A drawn placeholder rather than a stock photograph. A real-looking face attached
 * to an invented clinician on a health product is hard to walk back.
 */
export function Portrait({
  initials,
  size = 56,
  label,
}: {
  initials: string;
  size?: number;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label ?? `${initials} — placeholder portrait`}
      className="flex flex-none items-center justify-center rounded-full bg-sand"
      style={{ width: size, height: size }}
    >
      <span
        className="t-wordmark text-ink"
        style={{ fontSize: Math.round(size * 0.3), letterSpacing: "0.1em" }}
      >
        {initials}
      </span>
    </span>
  );
}

/** Inert. There is no media in a demo, and a fake play button that does nothing
    is more honest than one that opens an empty player. */
export function ResourceBlock({
  type,
  label,
}: {
  type: string;
  label: string;
}) {
  const media = type === "Video" || type === "Audio";
  return (
    <div className="flex flex-col gap-3 bg-sand p-5">
      <p className="t-eyebrow">{type}</p>
      {media ? (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-ink"
          >
            <svg
              viewBox="0 0 12 14"
              className="h-3 w-3 text-ink"
              aria-hidden="true"
            >
              <path d="M1 1l10 6-10 6z" fill="currentColor" />
            </svg>
          </span>
          <p className="t-meta text-fg-muted">{label}</p>
        </div>
      ) : (
        <p className="t-meta text-fg-muted">{label}</p>
      )}
      <p className="demo-stamp">Placeholder — no media in the demo</p>
    </div>
  );
}

/** A row of label and value, hairline-separated. The workhorse of these screens. */
export function Row({
  label,
  value,
  sub,
  href,
  right,
}: {
  label: ReactNode;
  value?: ReactNode;
  sub?: ReactNode;
  href?: string;
  right?: ReactNode;
}) {
  const body = (
    <span className="flex w-full items-start justify-between gap-4 py-3.5">
      <span className="flex min-w-0 flex-col gap-1">
        <span className="t-body">{label}</span>
        {sub ? <span className="t-meta text-fg-muted">{sub}</span> : null}
      </span>
      <span className="flex flex-none items-center gap-2">
        {value ? <span className="t-meta">{value}</span> : null}
        {right}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="block border-b border-rule last:border-b-0">
        {body}
      </Link>
    );
  }
  return <div className="border-b border-rule last:border-b-0">{body}</div>;
}

/**
 * Baseline → month 3 → month 6, drawn small. Greyed when the later readings are
 * still hidden, so nothing implies she has finished six months.
 */
export function Sparkline({
  values,
  muted,
}: {
  values: readonly (number | null)[];
  muted: boolean;
}) {
  const points = values.filter((v): v is number => v !== null);
  if (points.length < 2) {
    return <span className="block h-4 w-12" aria-hidden="true" />;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const w = 48;
  const h = 16;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`-1 -1 ${w + 2} ${h + 2}`}
      className="h-4 w-12 flex-none"
      aria-hidden="true"
      fill="none"
    >
      <path
        d={path}
        stroke={muted ? "var(--rule)" : "var(--brass)"}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
