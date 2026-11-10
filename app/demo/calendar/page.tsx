"use client";

import { useState } from "react";

import { Board, Hero, TabBar } from "@/components/demo/Board";
import {
  DEMO_MONTH,
  calendar,
  dayFor,
  fixedDaily,
  travelRule,
  weeks,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

const COLUMNS = ["M", "T", "W", "T", "F", "S", "S"] as const;

/** The data carries three letters; the footer line wants the whole word. */
const WEEKDAY: Readonly<Record<string, string>> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/** Five rows of seven, so the month sits in a square block. */
const CELLS = 35;

export default function CalendarPage() {
  const { state, set } = useDemo();
  const [open, setOpen] = useState<number | null>(null);
  const selected = open ?? state.day;
  const day = dayFor(selected);
  const week = weeks.find((w) => w.week === day.week)!;

  const lead = DEMO_MONTH.firstColumn - 1;
  const trail = CELLS - lead - DEMO_MONTH.days;

  return (
    <Board>
      <Hero
        wash="green"
        height={172}
        bar="Your month"
        title="December"
        titleSize={26}
        textTop={18}
        cap={`Week ${day.week} of ${weeks.length}`}
        capBelow
      />

      <div
        className="flex flex-1 flex-col bonebg"
        style={{ padding: "14px 16px 0" }}
      >
        <div className="cal" style={{ marginBottom: 5 }} aria-hidden="true">
          {COLUMNS.map((c, i) => (
            <div
              key={`${c}-${i}`}
              className="text-center"
              style={{
                fontSize: 7.5,
                letterSpacing: ".1em",
                color: "#9aa29b",
              }}
            >
              {c}
            </div>
          ))}
        </div>

        <div className="cal">
          {/* The tail of November, shown flat so the first Tuesday lands right. */}
          {Array.from({ length: lead }, (_, i) => (
            <Off key={`lead-${i}`} n={30 - (lead - 1 - i)} />
          ))}

          {calendar.map((d) => {
            const immersion = d.kinds.includes("immersion");
            const checkIn = d.kinds.includes("checkIn");
            const rest = d.kinds.includes("rest");
            const fill = immersion
              ? "im"
              : checkIn
                ? "ck"
                : rest
                  ? ""
                  : "rt";

            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setOpen(d.day)}
                aria-pressed={d.day === selected}
                aria-label={`${d.weekday} ${d.day} December`}
                className={`d ${fill}${d.day === state.day ? " tdy" : ""}`}
              >
                <span className="n">{d.day}</span>
                {rest ? null : <span className="dot" aria-hidden="true" />}
              </button>
            );
          })}

          {Array.from({ length: trail }, (_, i) => (
            <Off key={`trail-${i}`} n={i === 0 ? 31 : i} />
          ))}
        </div>

        <ul
          className="flex flex-wrap"
          style={{ gap: 11, marginTop: 12, listStyle: "none" }}
        >
          <Key fill="rgba(217,205,180,.7)">Routine</Key>
          <Key fill="rgba(169,132,72,.5)">Check-in</Key>
          <Key fill="var(--vetiver)">Immersion</Key>
        </ul>

        <div style={{ marginTop: "auto", paddingBottom: 86 }}>
          <div
            style={{
              borderTop: "1px solid rgba(169,132,72,.28)",
              paddingTop: 11,
            }}
          >
            <div className="cap" style={{ color: "var(--deepbrass)" }}>
              {WEEKDAY[day.weekday]} {day.day}
              {day.day === state.day ? " · today" : ""}
            </div>
            <p
              style={{
                fontSize: 10.5,
                color: "#4e574f",
                marginTop: 5,
                lineHeight: 1.5,
              }}
            >
              {day.added.map((a) => a.label).join(" · ")}
            </p>
            <p
              style={{
                fontSize: 9.5,
                color: "#8d958e",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {week.theme}. Plus every day: {fixedDaily.length} fixed
              anchors, from {fixedDaily[0]!.label.toLowerCase()} to{" "}
              {fixedDaily[fixedDaily.length - 1]!.label.toLowerCase()}.
            </p>

            {day.day === state.day ? null : (
              <button
                type="button"
                onClick={() => {
                  set({ day: day.day });
                  setOpen(null);
                }}
                className="trk"
                style={{
                  marginTop: 9,
                  fontSize: 8,
                  color: "var(--deepbrass)",
                }}
              >
                Make this today →
              </button>
            )}

            <p
              style={{
                fontSize: 9,
                color: "#9aa29b",
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              {travelRule}
            </p>
          </div>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}

/** A day outside the thirty — November's tail, or January's head. */
function Off({ n }: { n: number }) {
  return (
    <div className="d off" aria-hidden="true">
      <span className="n">{n}</span>
    </div>
  );
}

function Key({ fill, children }: { fill: string; children: string }) {
  return (
    <li className="flex items-center" style={{ gap: 5 }}>
      <i
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          background: fill,
          display: "block",
        }}
      />
      <span style={{ fontSize: 8.5, color: "#6b746c" }}>{children}</span>
    </li>
  );
}
