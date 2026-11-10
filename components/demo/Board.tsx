"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

/**
 * The reference chrome, ported from design-reference/s*.html.
 *
 * Screens built against the boards own their whole surface — the gradient
 * header, the ground beneath it, and the floating tab bar — rather than being
 * posted into a shared header and scroller. Everything here keeps the
 * reference's class names so a screen can be read beside its board.
 */

/** One screen: a flex column filling the phone, like the reference's .sc. */
export function Board({
  ground,
  className = "",
  style,
  children,
}: {
  ground?: "bone" | "sand" | "vetiver" | "ink";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const bg =
    ground === "sand"
      ? "sandbg"
      : ground === "vetiver"
        ? "vet"
        : ground === "ink"
          ? "ink-screen"
          : ground === "bone"
            ? "bonebg"
            : "";

  // Only the outer box is positioned. The scroller is left static on purpose,
  // so the tab bar inside it resolves its `bottom` against the phone and stays
  // put — were the scroller the containing block, the pill would slide away as
  // the screen is scrolled.
  return (
    <div className={`absolute inset-0 ${bg}`}>
      <div
        className={`flex h-full flex-col overflow-y-auto ${bg} ${className}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Treatment A's header: one of the three gradient washes under the four-stop
 * scrim, with the bar and the display line over it. There is no photography in
 * this design — the washes are the imagery.
 */
export function Hero({
  wash,
  height,
  bar,
  cap,
  title,
  titleSize = 25,
  textTop = 24,
  capBelow = false,
  progress,
}: {
  wash: "warm" | "green" | "stone";
  height: number;
  bar?: string;
  cap?: string;
  title?: ReactNode;
  titleSize?: number;
  textTop?: number;
  /** Some boards set the tracked line under the display line instead of over. */
  capBelow?: boolean;
  /** 0–1. Drawn as the hairline rule across the foot of the header. */
  progress?: number;
}) {
  return (
    <div className={`hero h-${wash} relative`} style={{ height }}>
      <div className="hbar">
        <span className="bg-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {bar ? (
          <span className="cap" style={{ color: "rgba(243,238,228,.8)" }}>
            {bar}
          </span>
        ) : null}
        <span className="av" aria-hidden="true" />
      </div>

      {cap || title ? (
        <div className="htxt" style={{ marginTop: textTop }}>
          {cap && !capBelow ? (
            <div className="cap" style={{ color: "rgba(217,205,180,.85)" }}>
              {cap}
            </div>
          ) : null}
          {title ? (
            <div
              className="d"
              style={{
                fontSize: titleSize,
                marginTop: cap && !capBelow ? 9 : 0,
              }}
            >
              {title}
            </div>
          ) : null}
          {cap && capBelow ? (
            <div
              className="cap"
              style={{ color: "rgba(217,205,180,.85)", marginTop: 7 }}
            >
              {cap}
            </div>
          ) : null}
        </div>
      ) : null}

      {progress === undefined ? null : (
        <div
          className="absolute right-5 bottom-[14px] left-5 z-[3] h-[2px] rounded-[2px]"
          style={{ background: "rgba(243,238,228,.22)" }}
        >
          <div
            className="h-[2px] rounded-[2px]"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: "var(--brass)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/** The glyph shapes are the reference's: square, circle, the disc, a diamond, circle. */
const TABS = [
  { href: "/demo/today", label: "Today", glyph: {} },
  { href: "/demo/plan", label: "Plan", glyph: { borderRadius: "50%" } },
  { href: "/demo/calendar", label: "Calendar", glyph: {} },
  {
    href: "/demo/markers",
    label: "Markers",
    glyph: { transform: "rotate(45deg)" },
  },
  { href: "/demo/guide", label: "Guide", glyph: { borderRadius: "50%" } },
] as const;

/**
 * The floating pill. `lt` on Bone, Sand and Vetiver; the translucent variant on
 * the Ink screens. The centre disc carries the torana with only the upper
 * architrave and the two posts drawn, as the reference does at this size.
 */
export function TabBar({ lt = false }: { lt?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={`tab${lt ? " lt" : ""}`} aria-label="Member">
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        const centre = tab.href === "/demo/calendar";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
            className="flex items-center justify-center"
          >
            {centre ? (
              <span className="tmain">
                <svg width="15" height="15" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M13.7 24.2C13.7 31 16 32.4 20 32.4H80C84 32.4 86.3 31 86.3 24.2"
                    stroke="#17211C"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="31.9"
                    y1="32.4"
                    x2="31.9"
                    y2="86"
                    stroke="#17211C"
                    strokeWidth="5"
                  />
                  <line
                    x1="68.1"
                    y1="32.4"
                    x2="68.1"
                    y2="86"
                    stroke="#17211C"
                    strokeWidth="5"
                  />
                </svg>
              </span>
            ) : (
              <i
                style={{
                  ...tab.glyph,
                  ...(active ? { borderColor: "var(--brass)" } : null),
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The full mark: both architraves, the lotus finial, the base rail, and the
 * threshold left open. Below 32px the lower architrave is dropped.
 */
export function Torana({
  size = 38,
  color = "#17211C",
}: {
  size?: number;
  color?: string;
}) {
  const compact = size < 32;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48.5" stroke={color} strokeWidth="1.6" />
      <path d="M50 9C54.6 15 55 21 50 25.8C45 21 45.4 15 50 9Z" fill={color} />
      <line
        x1="50"
        y1="25.8"
        x2="50"
        y2="33"
        stroke={color}
        strokeWidth="2.6"
      />
      <path
        d="M13.7 24.2C13.7 31 16 32.4 20 32.4H80C84 32.4 86.3 31 86.3 24.2"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {compact ? null : (
        <path
          d="M18.5 41.2C18.5 47.5 21 48.9 24.5 48.9H75.5C79 48.9 81.5 47.5 81.5 41.2"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <line
        x1="31.9"
        y1="32.4"
        x2="31.9"
        y2="89.6"
        stroke={color}
        strokeWidth="3"
      />
      <line
        x1="68.1"
        y1="32.4"
        x2="68.1"
        y2="89.6"
        stroke={color}
        strokeWidth="3"
      />
      <line
        x1="20.3"
        y1="89.6"
        x2="79.7"
        y2="89.6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The tracked caps pinned into the corners of a poster screen. */
export function CornerCap({
  side,
  children,
}: {
  side: "left" | "right";
  children: ReactNode;
}) {
  return (
    <span
      className="trk absolute top-[10px] text-[8px]"
      style={{
        color: "var(--deepbrass)",
        [side === "left" ? "left" : "right"]: 24,
      }}
    >
      {children}
    </span>
  );
}

/* --- Treatment C -------------------------------------------------------- */

/** The Ink screens' top bar: back, a tracked label, the overflow dots. */
export function InkBar({ label, href }: { label: string; href?: string }) {
  return (
    <div
      className="relative z-[5] flex items-center justify-between"
      style={{ padding: "14px 20px 0" }}
    >
      {href ? (
        <Link
          href={href}
          aria-label="Back"
          style={{ color: "rgba(243,238,228,.55)", fontSize: 13 }}
        >
          ←
        </Link>
      ) : (
        <span style={{ color: "rgba(243,238,228,.55)", fontSize: 13 }}>←</span>
      )}
      <span className="cap" style={{ color: "var(--sand)" }}>
        {label}
      </span>
      <span
        aria-hidden="true"
        style={{ color: "rgba(243,238,228,.55)", fontSize: 13 }}
      >
        ⋯
      </span>
    </div>
  );
}

/**
 * The 270° open-bottom arc. Stroke 6.5, round caps, track at 12% Bone, fill on
 * the brass gradient, a 6px Bone dot at the fill's end. The number sits inside
 * it, pulled up 70px so it never crosses the stroke.
 */
export function Arc({
  value,
  of,
  caption,
}: {
  value: number;
  of: number;
  caption: string;
}) {
  const t = Math.max(0, Math.min(1, of === 0 ? 0 : value / of));
  // Along the same 73px arc the reference sweeps, from (13,88) to (159,88).
  const angle = Math.PI * (1 - t);
  const cx = 86 + 73 * Math.cos(angle);
  const cy = 88 - 73 * Math.sin(angle);

  return (
    <div className="relative z-[5] mt-[18px] flex flex-col items-center">
      <svg width="172" height="96" viewBox="0 0 172 96" aria-hidden="true">
        <path
          d="M13 88 A73 73 0 0 1 159 88"
          fill="none"
          stroke="rgba(243,238,228,.12)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d={`M13 88 A73 73 0 0 1 ${cx.toFixed(1)} ${cy.toFixed(1)}`}
          fill="none"
          stroke="url(#arcFill)"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="arcFill" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7A5F2E" />
            <stop offset="1" stopColor="#E0BC7C" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r="6" fill="#F3EEE4" />
      </svg>

      <div style={{ marginTop: -70 }} className="text-center">
        <div
          className="dp"
          style={{ fontSize: 34, color: "var(--bone)", lineHeight: 1 }}
        >
          {value}
          <span style={{ fontSize: 15, color: "rgba(243,238,228,.45)" }}>
            /{of}
          </span>
        </div>
        <div
          className="cap"
          style={{ color: "rgba(217,205,180,.7)", marginTop: 6 }}
        >
          {caption}
        </div>
      </div>
    </div>
  );
}

/** Baseline / Mar / Jun. The active segment is a near-solid Bone pill. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="relative z-[5] flex"
      style={{
        margin: "15px 20px 0",
        background: "rgba(243,238,228,.07)",
        borderRadius: 999,
        padding: 3,
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 999,
              background: on ? "rgba(243,238,228,.92)" : "transparent",
              color: on ? "var(--ink)" : "rgba(243,238,228,.45)",
              fontSize: 9.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A 40×14 sparkline. Flat when there is only one reading to draw. */
export function Spark({ points }: { points: readonly number[] }) {
  const xs = [2, 19, 38];
  const lo = Math.min(...points);
  const hi = Math.max(...points);
  const span = hi - lo || 1;
  const d = points
    .map((p, i) => `${xs[i] ?? 38},${(11 - ((p - lo) / span) * 8).toFixed(1)}`)
    .join(" ");

  return (
    <svg width="40" height="14" aria-hidden="true">
      <polyline points={d} fill="none" stroke="#9DBFA2" strokeWidth="1.4" />
    </svg>
  );
}
