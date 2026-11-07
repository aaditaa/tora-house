"use client";

import Link from "next/link";
import { useState } from "react";

import { Screen, Sparkline, StatusChip } from "@/components/demo/Bits";
import {
  indianReferenceNote,
  markerGroups,
  pillars,
  type Marker,
} from "@/lib/demo-data";
import { useDemo, type Horizon } from "@/lib/demo-state";

const HORIZONS: { id: Horizon; label: string }[] = [
  { id: "baseline", label: "Baseline" },
  { id: "m3", label: "Month 3" },
  { id: "m6", label: "Month 6" },
];

/** Readings later than baseline stay out of reach until someone reveals them. */
function readingFor(marker: Marker, horizon: Horizon): string | null {
  if (horizon === "m6") return marker.m6 ?? marker.m3 ?? marker.baseline;
  if (horizon === "m3") return marker.m3 ?? marker.baseline;
  return marker.baseline;
}

function numeric(value: string | null): number | null {
  if (!value) return null;
  const n = parseFloat(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export default function MarkersPage() {
  const { state, set } = useDemo();
  const [noteOpen, setNoteOpen] = useState(false);
  const horizon = state.horizon;

  return (
    <Screen
      eyebrow="Your readings"
      title="Markers over time."
      lede="One reading of your own baseline, read against the bands your clinical practitioner sets. They are printed next to every number."
    >
      <div
        className="flex gap-1"
        role="group"
        aria-label="Which readings to show"
      >
        {HORIZONS.map((h) => {
          const active = horizon === h.id;
          const locked = h.id !== "baseline" && horizon === "baseline";
          return (
            <button
              key={h.id}
              type="button"
              aria-pressed={active}
              onClick={() => set({ horizon: h.id })}
              className={`t-eyebrow flex-1 border px-2 py-2 text-[0.5625rem] transition-colors duration-200 ${
                active
                  ? "border-ink bg-ink"
                  : locked
                    ? "border-rule opacity-50"
                    : "border-rule"
              }`}
              style={active ? { color: "var(--bone)" } : undefined}
            >
              {h.label}
            </button>
          );
        })}
      </div>

      {horizon === "baseline" ? (
        <p className="t-meta text-fg-muted">
          Month 3 and month 6 are shown for what they would look like. Meera is
          on Day 1 — she has not been measured again yet.
        </p>
      ) : null}

      {markerGroups.map((group) => (
        <section key={group.id} className="flex flex-col gap-3">
          <hr className="rule-brass" />
          <h2 className="t-eyebrow">{group.system}</h2>

          <div className="flex flex-col border-t border-rule">
            {group.markers.map((m) => {
              const reading = readingFor(m, horizon);
              const series = [
                numeric(m.baseline),
                numeric(m.m3),
                numeric(m.m6),
              ];
              return (
                <Link
                  key={m.id}
                  href={`/demo/markers/${m.id}`}
                  className="flex flex-col gap-1.5 border-b border-rule py-3.5"
                >
                  {/* Two lines, not one. At 296px a name, a sparkline, a reading and
                      a chip on one row leaves the name about thirty pixels. */}
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="t-body">{m.name}</span>
                    <span className="t-meta flex-none">{reading}</span>
                  </span>
                  <span className="flex items-center justify-between gap-3">
                    <span className="t-eyebrow text-[0.5625rem]">
                      Band {m.band}
                    </span>
                    <span className="flex flex-none items-center gap-2.5">
                      <Sparkline
                        values={series}
                        muted={horizon === "baseline"}
                      />
                      <StatusChip status={m.status} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="t-meta text-fg-muted">{group.tells}</p>
          {group.movedBy.length > 0 ? (
            <p className="t-eyebrow">
              Moved by{" "}
              {group.movedBy
                .map((id) => pillars.find((p) => p.id === id)?.name ?? id)
                .join(" · ")}
            </p>
          ) : null}
        </section>
      ))}

      <div className="flex flex-col gap-3 bg-sand p-5">
        <button
          type="button"
          onClick={() => setNoteOpen((v) => !v)}
          aria-expanded={noteOpen}
          className="flex items-center justify-between gap-4 text-left"
        >
          <span className="t-h3">Why these bands?</span>
          <span
            aria-hidden="true"
            className="relative h-3 w-3 flex-none text-fg-muted"
          >
            <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
            {noteOpen ? null : (
              <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current" />
            )}
          </span>
        </button>
        {noteOpen ? (
          <p className="t-meta text-fg-muted">{indianReferenceNote}</p>
        ) : null}
      </div>
    </Screen>
  );
}
