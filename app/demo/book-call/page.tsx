"use client";

import Link from "next/link";
import { useState } from "react";

import { Board, TabBar } from "@/components/demo/Board";
import { guide } from "@/lib/demo-data";

const SLOTS = [
  { id: "thu", day: "Thu 4", time: "16:00 — 16:40" },
  { id: "fri", day: "Fri 5", time: "11:00 — 11:40" },
  { id: "mon", day: "Mon 8", time: "09:30 — 10:10" },
];

/** 05 · Book a call. Treatment A, h-stone. */
export default function BookCallPage() {
  const [picked, setPicked] = useState("fri");
  const chosen = SLOTS.find((s) => s.id === picked);

  return (
    <Board>
      <div className="hero h-stone relative" style={{ height: 244 }}>
        <div className="hbar">
          <span className="bg-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cap" style={{ color: "rgba(243,238,228,.82)" }}>
            {guide.role}
          </span>
          <span className="av" aria-hidden="true" />
        </div>

        <div
          className="htxt flex flex-col items-center"
          style={{ marginTop: 20 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "linear-gradient(140deg,#d6c6a8,#7a6648)",
              border: "1px solid rgba(243,238,228,.4)",
            }}
          />
          <h1 className="d" style={{ fontSize: 24, marginTop: 12 }}>
            {guide.name}
          </h1>
          <div
            className="cap"
            style={{ color: "rgba(217,205,180,.85)", marginTop: 7 }}
          >
            Yoga therapy · Rehab · 11 years
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "18px 20px 0" }}
      >
        <p className="body" style={{ color: "#5d665f" }}>
          She will read your survey before you speak. Forty minutes, and nothing
          to prepare.
        </p>

        <div
          className="cap"
          style={{ color: "var(--deepbrass)", marginTop: 18 }}
        >
          Choose a time
        </div>

        <div
          className="flex flex-col"
          style={{ marginTop: 12, gap: 8 }}
          role="radiogroup"
          aria-label="Choose a time"
        >
          {SLOTS.map((slot) => {
            const on = slot.id === picked;
            return (
              <button
                key={slot.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(slot.id)}
                className="flex w-full items-center text-left"
                style={{
                  gap: 12,
                  border: on
                    ? "1px solid var(--vetiver)"
                    : "1px solid rgba(169,132,72,.35)",
                  background: on ? "var(--vetiver)" : "transparent",
                  borderRadius: 13,
                  padding: "11px 13px",
                }}
              >
                <span
                  className="dp"
                  style={{
                    fontSize: 14,
                    color: on ? "var(--sand)" : "var(--brass)",
                    width: 52,
                  }}
                >
                  {slot.day}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: on ? "var(--bone)" : "var(--ink)",
                  }}
                >
                  {slot.time}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: on ? "var(--bone)" : "transparent",
                    border: on ? undefined : "1px solid rgba(23,33,28,.25)",
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-auto" style={{ paddingBottom: 86 }}>
          <Link href="/demo/book-panel" className="btn ink w-full">
            Confirm{" "}
            {chosen?.day.split(" ")[0] === "Thu"
              ? "Thursday"
              : chosen?.day.split(" ")[0] === "Fri"
                ? "Friday"
                : "Monday"}
          </Link>
          <p
            className="text-center"
            style={{ fontSize: 9.5, color: "#8d958e", marginTop: 10 }}
          >
            Phone, or video if you prefer
          </p>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}
