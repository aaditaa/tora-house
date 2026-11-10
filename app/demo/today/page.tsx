"use client";

import Link from "next/link";

import { Board, TabBar, Torana } from "@/components/demo/Board";
import { calendar, fixedDaily, guide, itemTimes } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

/**
 * 12 · Today. Treatment A, h-warm.
 *
 * The Bone sheet overlaps the header by −34px with its own shadow. That overlap
 * is the signature of the app and happens on this screen and nowhere else.
 */
/** Reachable from here, and nowhere else in the chrome. */
const ELSEWHERE = [
  { href: "/demo/calendar", label: "The month" },
  { href: "/demo/immersions", label: "Immersions" },
  { href: "/demo/progress", label: "Progress" },
] as const;

export default function TodayPage() {
  const { state, toggleTick, isTicked } = useDemo();
  const day = calendar.find((d) => d.day === state.day) ?? calendar[0]!;

  // Minutes, not strings: "6:20".localeCompare("18:30") puts the evening first.
  const minutes = (t: string) => {
    if (!t) return 24 * 60 + 1;
    const [h, m] = t.split(":");
    return Number(h) * 60 + Number(m);
  };

  const rows = [...fixedDaily, ...day.added]
    .map((item) => ({ ...item, time: itemTimes[item.id] ?? "" }))
    .sort((a, b) => minutes(a.time) - minutes(b.time));

  const done = rows.filter((r) => isTicked(day.day, r.id)).length;

  return (
    <Board>
      <div className="hero h-warm relative" style={{ height: 276 }}>
        <div className="hbar">
          <span className="bg-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="flex flex-col items-center" style={{ gap: 3 }}>
            <Torana size={15} color="#F3EEE4" />
            <span
              className="dp"
              style={{
                fontSize: 11,
                letterSpacing: ".3em",
                textIndent: ".3em",
                color: "var(--bone)",
              }}
            >
              TORA HOUSE
            </span>
          </span>
          <span className="av" aria-hidden="true" />
        </div>

        <div className="htxt" style={{ marginTop: 38 }}>
          <div className="cap" style={{ color: "rgba(243,238,228,.75)" }}>
            {day.weekday}sday {day.day} December · Day {day.day}
          </div>
          <h1
            className="d"
            style={{ fontSize: 40, letterSpacing: ".07em", marginTop: 6 }}
          >
            TODAY
          </h1>
          <div
            className="cap"
            style={{ color: "rgba(217,205,180,.8)", marginTop: 8 }}
          >
            {rows.length} things, {done} done
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)" }}
      >
        <div className="relative z-[5]" style={{ margin: "-34px 14px 0" }}>
          <div
            className="sheet"
            style={{ boxShadow: "0 12px 34px rgba(23,33,28,.16)" }}
          >
            <div className="cap" style={{ color: "var(--deepbrass)" }}>
              Your day
            </div>

            <div style={{ marginTop: 10 }}>
              {rows.map((row) => {
                const on = isTicked(day.day, row.id);
                return (
                  <button
                    key={row.id}
                    type="button"
                    className="rw w-full text-left"
                    aria-pressed={on}
                    onClick={() => toggleTick(day.day, row.id)}
                  >
                    <span
                      className="dp"
                      style={{
                        width: 42,
                        fontSize: 14,
                        color: "var(--brass)",
                      }}
                    >
                      {row.time}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        color: "var(--ink)",
                      }}
                    >
                      {row.label}
                    </span>
                    <span className={on ? "tick on" : "tick"}>
                      {on ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-auto" style={{ padding: "0 20px 110px" }}>
          <div
            className="flex items-center"
            style={{
              gap: 10,
              borderTop: "1px solid rgba(169,132,72,.28)",
              paddingTop: 13,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(140deg,#b9a583,#6f5c3f)",
              }}
            />
            <span style={{ flex: 1 }}>
              <span
                className="block"
                style={{ fontSize: 11.5, color: "var(--ink)" }}
              >
                {guide.name.split(" ")[0]}
              </span>
              <span
                className="block"
                style={{ fontSize: 9.5, color: "#8d958e" }}
              >
                Check-in Friday, 15 minutes
              </span>
            </span>
            <Link
              href="/demo/guide"
              className="btn ink"
              style={{ padding: "7px 14px", fontSize: 9 }}
            >
              Message
            </Link>
          </div>

          {/* The three screens the tab bar does not name. Without these the
              month, the invitation list and the record have no way in. */}
          <nav
            className="flex justify-between"
            style={{
              gap: 10,
              borderTop: "1px solid rgba(169,132,72,.28)",
              marginTop: 13,
              paddingTop: 12,
            }}
            aria-label="Elsewhere"
          >
            {ELSEWHERE.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="trk"
                style={{ fontSize: 8, color: "var(--deepbrass)" }}
              >
                {e.label} →
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}
