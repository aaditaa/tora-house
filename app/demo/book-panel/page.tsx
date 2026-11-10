"use client";

import Link from "next/link";
import { useState } from "react";

import { Board, Hero, TabBar } from "@/components/demo/Board";
import { panelGroups, panelPrep } from "@/lib/demo-data";

const DAYS = [
  { n: "09", d: "TUE" },
  { n: "10", d: "WED" },
  { n: "11", d: "THU" },
  { n: "12", d: "FRI" },
];

const FULL: Record<string, string> = {
  "09": "Tuesday",
  "10": "Wednesday",
  "11": "Thursday",
  "12": "Friday",
};

/** 06 · Book the baseline panel. Treatment A, h-warm. */
export default function BookPanelPage() {
  const [where, setWhere] = useState<"home" | "centre">("home");
  const [day, setDay] = useState("10");

  return (
    <Board>
      <Hero
        wash="warm"
        height={206}
        bar="Baseline panel"
        cap="Step three"
        title={
          <>
            It starts
            <br />
            <i>with facts</i>
          </>
        }
        titleSize={25}
        textTop={26}
      />

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "16px 20px 0" }}
      >
        <div className="cap" style={{ color: "var(--deepbrass)" }}>
          Where
        </div>
        <div className="flex" style={{ gap: 8, marginTop: 10 }}>
          {(
            [
              { id: "home", title: "At home", sub: "Collection, 7–9am" },
              { id: "centre", title: "At the centre", sub: "Indiranagar" },
            ] as const
          ).map((opt) => {
            const on = where === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={on}
                onClick={() => setWhere(opt.id)}
                className="flex-1 text-left"
                style={{
                  border: on
                    ? "1px solid var(--vetiver)"
                    : "1px solid rgba(169,132,72,.35)",
                  background: on ? "var(--vetiver)" : "transparent",
                  borderRadius: 13,
                  padding: "11px 10px",
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    color: on ? "var(--bone)" : "var(--ink)",
                  }}
                >
                  {opt.title}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: on ? "var(--sand)" : "#8d958e",
                    marginTop: 3,
                  }}
                >
                  {opt.sub}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="cap"
          style={{ color: "var(--deepbrass)", marginTop: 16 }}
        >
          When
        </div>
        <div className="flex" style={{ gap: 6, marginTop: 10 }}>
          {DAYS.map((d) => {
            const on = day === d.n;
            return (
              <button
                key={d.n}
                type="button"
                aria-pressed={on}
                onClick={() => setDay(d.n)}
                className="flex-1 text-center"
                style={{
                  border: on
                    ? "1px solid var(--sand)"
                    : "1px solid rgba(169,132,72,.35)",
                  background: on ? "var(--sand)" : "transparent",
                  borderRadius: 11,
                  padding: "8px 0",
                }}
              >
                <div
                  className="dp"
                  style={{ fontSize: 15, color: "var(--ink)" }}
                >
                  {d.n}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    letterSpacing: ".12em",
                    color: on ? "#5d665f" : "#8d958e",
                  }}
                >
                  {d.d}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="cap"
          style={{ color: "var(--deepbrass)", marginTop: 16 }}
        >
          What it covers
        </div>
        <div className="flex flex-wrap" style={{ gap: 6, marginTop: 9 }}>
          {panelGroups.map((g) => (
            <span
              key={g.id}
              style={{
                background: "rgba(217,205,180,.45)",
                borderRadius: 999,
                padding: "5px 10px",
                fontSize: 9.5,
                color: "#4e574f",
              }}
            >
              {g.system}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            borderTop: "1px solid rgba(169,132,72,.28)",
            paddingTop: 11,
          }}
        >
          <p style={{ fontSize: 10, color: "#6b746c", lineHeight: 1.5 }}>
            {panelPrep}
          </p>
        </div>

        <div className="mt-auto" style={{ paddingBottom: 86 }}>
          <Link href="/demo/report" className="btn ink w-full">
            Book {FULL[day]}
          </Link>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}
