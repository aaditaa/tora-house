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

/* ─── Marker charts ─────────────────────────────────────────────────────────
   A reading's job is to be read against its band, so the mark is a track with
   the band on it, not a line of its own. Colour carries nothing on its own
   here: the reading, the band and the status are all printed in words beside
   the track, and the live dot is ink rather than brass because brass sits at
   2.99:1 on bone and cannot be the only thing saying where she is. */

export type Band = { min?: number; max?: number } | null;

/** The five shapes Appendix F writes a band in. Anything else has no band. */
export function parseBand(band: string): Band {
  const n = (s: string | undefined) => {
    const v = parseFloat(s ?? "");
    return Number.isFinite(v) ? v : undefined;
  };
  let m: RegExpMatchArray | null;
  if ((m = band.match(/^under\s+([\d.]+)/i))) return { max: n(m[1]) };
  if ((m = band.match(/^above\s+([\d.]+)/i))) return { min: n(m[1]) };
  if ((m = band.match(/^([\d.]+)\s*(?:–|—|-|to)\s*([\d.]+)/i)))
    return { min: n(m[1]), max: n(m[2]) };
  if ((m = band.match(/^([\d.]+)\s+or\s+above/i))) return { min: n(m[1]) };
  return null;
}

/** The first number in a reading, ignoring its unit. */
export function numeric(value: string | null | undefined): number | null {
  if (!value) return null;
  const v = parseFloat(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(v) ? v : null;
}

/**
 * One marker on a track. `readings` is [baseline, m3, m6]; `shown` is how far
 * along she has been revealed. Earlier readings stay as open dots so the
 * direction of travel is visible without a second chart.
 */
export function MarkerTrack({
  band,
  readings,
  shown,
  tall = false,
}: {
  band: string;
  readings: readonly (number | null)[];
  shown: number;
  tall?: boolean;
}) {
  const parsed = parseBand(band);
  const visible = readings
    .slice(0, shown + 1)
    .map((v, i) => ({ v, i }))
    .filter((r): r is { v: number; i: number } => r.v !== null);

  if (visible.length === 0) return null;

  const marks = visible.map((r) => r.v);
  const bounds = [parsed?.min, parsed?.max].filter(
    (v): v is number => v !== undefined,
  );
  const all = [...marks, ...bounds];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  // A flat domain (one reading, no band) still needs width to sit in.
  const pad = (hi - lo || Math.abs(hi) || 1) * 0.28;
  const min = lo - pad;
  const max = hi + pad;
  const at = (v: number) => ((v - min) / (max - min)) * 100;

  const bandLeft = parsed?.min !== undefined ? at(parsed.min) : 0;
  const bandRight = parsed?.max !== undefined ? at(parsed.max) : 100;
  const current = visible[visible.length - 1]!;
  const earlier = visible.slice(0, -1);
  const from = earlier.length > 0 ? at(earlier[0]!.v) : null;
  const to = at(current.v);

  return (
    <span
      className={`demo-track ${tall ? "demo-track-tall" : ""}`}
      aria-hidden="true"
    >
      <span className="demo-track-line" />
      {parsed ? (
        <span
          className="demo-track-band"
          data-edge-left={parsed.min !== undefined ? "on" : undefined}
          data-edge-right={parsed.max !== undefined ? "on" : undefined}
          style={{
            left: `${bandLeft}%`,
            width: `${Math.max(bandRight - bandLeft, 0.5)}%`,
          }}
        />
      ) : null}
      {from !== null ? (
        <span
          className="demo-track-move"
          style={{
            left: `${Math.min(from, to)}%`,
            width: `${Math.abs(to - from)}%`,
          }}
        />
      ) : null}
      {earlier.map((r) => (
        <span
          key={r.i}
          className="demo-track-was"
          style={{ left: `${at(r.v)}%` }}
        />
      ))}
      <span className="demo-track-now" style={{ left: `${to}%` }} />
    </span>
  );
}

/**
 * The three readings over time, with the band drawn behind them. One series, so
 * no legend — the screen's title names it — and every point carries its own
 * number, which is also the table of values printed below the chart.
 */
export function MarkerHistory({
  band,
  readings,
  labels,
  unit,
}: {
  band: string;
  readings: readonly (string | null)[];
  labels: readonly string[];
  unit?: string;
}) {
  const parsed = parseBand(band);
  const points = readings
    .map((r, i) => ({ text: r, v: numeric(r), i }))
    .filter((p): p is { text: string; v: number; i: number } => p.v !== null);

  if (points.length === 0) return null;

  const bounds = [parsed?.min, parsed?.max].filter(
    (v): v is number => v !== undefined,
  );
  const all = [...points.map((p) => p.v), ...bounds];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = (hi - lo || Math.abs(hi) || 1) * 0.3;
  const min = lo - pad;
  const max = hi + pad;

  const W = 280;
  const H = 128;
  const top = 22;
  const bottom = 26;
  const side = 26;
  const x = (i: number) =>
    side + (i / Math.max(readings.length - 1, 1)) * (W - side * 2);
  const y = (v: number) =>
    top + (1 - (v - min) / (max - min)) * (H - top - bottom);

  const bandTop = parsed?.max !== undefined ? y(parsed.max) : top;
  const bandBottom = parsed?.min !== undefined ? y(parsed.min) : H - bottom;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="demo-chart"
      role="img"
      aria-label={`Readings over time. Band ${band}. ${points
        .map((p) => `${labels[p.i]}: ${p.text}`)
        .join(". ")}.`}
    >
      {parsed ? (
        <>
          <rect
            x={0}
            y={bandTop}
            width={W}
            height={Math.max(bandBottom - bandTop, 1)}
            fill="var(--brass)"
            opacity="0.16"
          />
          {parsed.max !== undefined ? (
            <line
              x1={0}
              x2={W}
              y1={bandTop}
              y2={bandTop}
              stroke="var(--brass)"
              strokeWidth="1"
            />
          ) : null}
          {parsed.min !== undefined ? (
            <line
              x1={0}
              x2={W}
              y1={bandBottom}
              y2={bandBottom}
              stroke="var(--brass)"
              strokeWidth="1"
            />
          ) : null}
        </>
      ) : null}

      {points.length > 1 ? (
        <polyline
          points={points.map((p) => `${x(p.i)},${y(p.v)}`).join(" ")}
          fill="none"
          stroke="var(--fg)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {points.map((p) => (
        <g key={p.i}>
          <circle
            cx={x(p.i)}
            cy={y(p.v)}
            r="5"
            fill="var(--fg)"
            stroke="var(--surface)"
            strokeWidth="2"
          />
          <text
            className="demo-chart-value"
            x={x(p.i)}
            y={y(p.v) - 11}
            textAnchor="middle"
          >
            {p.text}
          </text>
        </g>
      ))}

      {readings.map((_, i) => (
        <text
          key={labels[i]}
          className="demo-chart-axis"
          x={x(i)}
          y={H - 8}
          textAnchor="middle"
        >
          {labels[i]}
        </text>
      ))}

      {unit ? (
        <text className="demo-chart-axis" x={0} y={12} textAnchor="start">
          {unit}
        </text>
      ) : null}
    </svg>
  );
}
