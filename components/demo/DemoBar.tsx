"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ToranaMark } from "@/components/Brand";
import { DEMO_MONTH, demoScreens, tourSeconds } from "@/lib/demo-data";
import { useDemo, type Horizon } from "@/lib/demo-state";

const HORIZONS: { id: Horizon; label: string }[] = [
  { id: "baseline", label: "Baseline" },
  { id: "m3", label: "Month 3" },
  { id: "m6", label: "Month 6" },
];

const QUICK_DAYS = [1, 15, 30];

/**
 * The demo controls. Hidden behind a small mark by default, because a walk-through
 * should not be framed by its own scaffolding — then opened when someone wants to
 * jump to Day 15 mid-sentence.
 *
 * This lives in the demo layout, which does not remount between screens, so
 * auto-play survives navigation.
 */
export function DemoBar() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { state, set, reset } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  const index = demoScreens.findIndex((s) => s.href === pathname);
  const current = index >= 0 ? index : 0;

  // Auto-play. Each screen declares its own dwell, so the report and the markers
  // get the time a room actually needs and the booking screens do not.
  useEffect(() => {
    if (!playing) return;
    const here = demoScreens[current]!;
    const timer = window.setTimeout(() => {
      const next = current + 1;
      if (next >= demoScreens.length) {
        setPlaying(false);
        return;
      }
      router.push(demoScreens[next]!.href);
    }, here.seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [playing, current, router]);

  // Escape closes the panel. Anything that opens over a demo should.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const startTour = useCallback(() => {
    setPlaying(true);
    setOpen(false);
    if (pathname !== demoScreens[0]!.href) router.push(demoScreens[0]!.href);
  }, [pathname, router]);

  const onReset = useCallback(() => {
    setPlaying(false);
    setOpen(false);
    reset();
    router.push("/demo");
  }, [reset, router]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center">
      {open ? (
        <div
          ref={panelRef}
          className="on-dark pointer-events-auto max-h-[70svh] w-full overflow-y-auto border-t border-rule bg-ink"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-5">
            {/* Jump to any screen */}
            <Section label={`Jump · ${current + 1} of ${demoScreens.length}`}>
              <div className="flex flex-wrap gap-1.5">
                {demoScreens.map((s, i) => (
                  <Chip
                    key={s.href}
                    on={i === current}
                    onClick={() => {
                      setPlaying(false);
                      setOpen(false);
                      router.push(s.href);
                    }}
                  >
                    {s.label}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Jump to any day */}
            <Section
              label={`Day ${state.day} of ${DEMO_MONTH.days} · ${DEMO_MONTH.label}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={DEMO_MONTH.days}
                  value={state.day}
                  onChange={(e) => set({ day: Number(e.target.value) })}
                  aria-label="Day of the month"
                  className="h-1 flex-1 accent-[var(--brass)]"
                />
                {QUICK_DAYS.map((d) => (
                  <Chip
                    key={d}
                    on={state.day === d}
                    onClick={() => set({ day: d })}
                  >
                    Day {d}
                  </Chip>
                ))}
              </div>
            </Section>

            {/* Reveal the later readings */}
            <Section label="Readings shown">
              <div className="flex flex-wrap items-center gap-1.5">
                {HORIZONS.map((h) => (
                  <Chip
                    key={h.id}
                    on={state.horizon === h.id}
                    onClick={() => set({ horizon: h.id })}
                  >
                    {h.label}
                  </Chip>
                ))}
                <span className="t-meta pl-1 text-fg-muted">
                  Month 3 and 6 are illustrative — she is on Day {state.day}.
                </span>
              </div>
            </Section>

            {/* Auto-play and reset */}
            <Section
              label={`Auto-play · about ${Math.round(tourSeconds / 60)} minutes`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => (playing ? setPlaying(false) : startTour())}
                  className="btn btn-primary min-h-0 py-3"
                >
                  {playing ? "Stop" : "Play the journey"}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="btn btn-quiet min-h-0 py-3"
                >
                  Reset demo
                </button>
                {playing ? (
                  <span className="t-meta text-fg-muted">
                    {demoScreens[current]!.label} — next in{" "}
                    {demoScreens[current]!.seconds}s
                  </span>
                ) : null}
              </div>
            </Section>

            <p className="t-meta text-fg-muted">
              Everything in this demo is invented, including every reading and
              every reference band. Nothing here is a real person or a medical
              service.
            </p>
          </div>
        </div>
      ) : null}

      {/* The progress hairline is the only sign of auto-play when the bar is shut. */}
      {playing && !open ? (
        <div
          aria-hidden="true"
          className="pointer-events-none h-px w-full bg-rule"
        >
          <div
            className="h-px bg-brass transition-[width] duration-500 ease-linear"
            style={{ width: `${((current + 1) / demoScreens.length) * 100}%` }}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Hide demo controls" : "Show demo controls"}
        className="pointer-events-auto mb-3 flex items-center gap-2 rounded-full border border-brass bg-ink px-3 py-1.5"
      >
        <ToranaMark className="h-3.5 w-3.5 text-bone" compact />
        <span
          className="t-eyebrow text-[0.5625rem]"
          style={{ color: "var(--bone)" }}
        >
          {playing ? "Playing" : "Demo"}
        </span>
      </button>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="t-eyebrow">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  children,
  on,
  onClick,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`t-eyebrow border px-2.5 py-1.5 text-[0.5625rem] transition-colors duration-200 ${
        on ? "border-bone bg-bone" : "border-rule"
      }`}
      style={on ? { color: "var(--ink)" } : { color: "var(--bone)" }}
    >
      {children}
    </button>
  );
}
