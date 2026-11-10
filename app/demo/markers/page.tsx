"use client";

import Link from "next/link";

import {
  Arc,
  Board,
  InkBar,
  Segmented,
  Spark,
  TabBar,
} from "@/components/demo/Board";
import { markerGroups, type Marker } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

type Horizon = "baseline" | "m3" | "m6";

function reading(m: Marker, h: Horizon) {
  return h === "m3" ? m.m3 : h === "m6" ? m.m6 : m.baseline;
}

/**
 * The row shows the figure alone, as the board does — "104", not "104 mg/dL".
 * The unit belongs with the band, which is on the marker itself; carrying it
 * here wraps the 42px column onto a second line and breaks the row rhythm.
 */
function figure(value: string | null): string {
  if (!value) return "—";
  const m = value.match(/^([\d.]+\s*%?)/);
  return (m ? m[1] : value).replace(/\s+/g, "");
}

/** 08 · Markers over time. Treatment C, Ink. */
export default function MarkersPage() {
  const { state, set } = useDemo();
  const h = state.horizon as Horizon;

  const all = markerGroups.flatMap((g) => g.markers);
  const scored = all.filter((m) => !m.unscoredNote);
  const inRange = scored.filter((m) => m.status === "In range").length;

  return (
    <Board ground="ink" style={{ padding: "52px 0 0" }}>
      <div className="glow" aria-hidden="true" />

      <InkBar label="Your markers" href="/demo/report" />

      <Segmented
        value={h}
        onChange={(v) => set({ horizon: v })}
        options={[
          { value: "baseline", label: "Baseline" },
          { value: "m3", label: "Mar" },
          { value: "m6", label: "Jun" },
        ]}
      />

      <Arc
        value={inRange}
        of={scored.length}
        caption={
          h === "baseline"
            ? "In range at baseline"
            : h === "m3"
              ? "In range at month 3"
              : "In range at month 6"
        }
      />

      <div className="relative z-[5]" style={{ padding: "20px 20px 124px" }}>
        {markerGroups.map((group) => (
          <div key={group.id}>
            <div
              className="cap"
              style={{ color: "var(--brass)", marginTop: 14 }}
            >
              {group.system}
            </div>

            {group.markers.map((m) => {
              const value = reading(m, h);
              const pts = [m.baseline, m.m3, m.m6]
                .map((v) => (v ? parseFloat(v) : null))
                .filter((v): v is number => v !== null && !Number.isNaN(v));

              return (
                <Link
                  key={m.id}
                  href={`/demo/markers/${m.id}`}
                  className="crow"
                >
                  <span
                    style={{ flex: 1, fontSize: 11.5, color: "var(--bone)" }}
                  >
                    {m.name}
                  </span>
                  {pts.length > 1 ? <Spark points={pts} /> : null}
                  <span
                    className="dp"
                    style={{
                      fontSize: 12,
                      color: value ? "var(--bone)" : "rgba(243,238,228,.35)",
                      width: 42,
                      textAlign: "right",
                    }}
                  >
                    {figure(value)}
                  </span>
                  {m.unscoredNote ? (
                    <span
                      style={{
                        fontSize: 7.4,
                        color: "rgba(217,205,180,.55)",
                      }}
                    >
                      Noted
                    </span>
                  ) : (
                    <span
                      className={`chip ${
                        m.status === "In range"
                          ? "ok"
                          : m.status === "Low"
                            ? "low"
                            : "watch"
                      }`}
                    >
                      {m.status === "Worth watching" ? "Watch" : m.status}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <TabBar />
    </Board>
  );
}
