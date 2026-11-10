"use client";

import Link from "next/link";

import { Board, TabBar } from "@/components/demo/Board";
import { calendar, guide, messages, redFlagRule } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

/** The plan change the thread refers to, taken from the day it lands on. */
const PLAN_CHANGE = "music-relax";

export default function GuidePage() {
  const { state } = useDemo();

  // Only what has been said by the day the demo is on. The thread grows as the
  // month is walked rather than showing her a future she has not had yet.
  const sofar = messages.filter((m) => m.day <= state.day);
  const nextCheckIn = calendar.find(
    (d) => d.day >= state.day && d.kinds.includes("checkIn"),
  );

  const changeDay = calendar.find((d) =>
    d.added.some((a) => a.id === PLAN_CHANGE),
  );
  const change = changeDay?.added.find((a) => a.id === PLAN_CHANGE);
  const showChange = changeDay !== undefined && changeDay.day <= state.day;

  return (
    <Board>
      <div className="hero h-stone relative" style={{ height: 184 }}>
        <div className="hbar">
          <Link
            href="/demo/today"
            aria-label="Back"
            style={{ color: "rgba(243,238,228,.8)", fontSize: 13 }}
          >
            ←
          </Link>
          <span className="cap" style={{ color: "rgba(243,238,228,.82)" }}>
            {guide.role}
          </span>
          <span
            aria-hidden="true"
            style={{ color: "rgba(243,238,228,.8)", fontSize: 13 }}
          >
            ☎
          </span>
        </div>

        <div
          className="htxt flex flex-col items-center"
          style={{ marginTop: 12 }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(140deg,#d6c6a8,#7a6648)",
              border: "1px solid rgba(243,238,228,.4)",
            }}
          />
          <h1 className="d" style={{ fontSize: 19, marginTop: 9 }}>
            {guide.name}
          </h1>
          <p
            className="cap"
            style={{ color: "rgba(217,205,180,.85)", marginTop: 5 }}
          >
            {nextCheckIn
              ? `Next check-in · ${nextCheckIn.weekday} ${nextCheckIn.day} December`
              : "Month review complete"}
          </p>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col bonebg"
        style={{ padding: "14px 16px 0", gap: 9 }}
      >
        {sofar.length === 0 ? (
          <p style={{ fontSize: 10.5, color: "#8d958e", lineHeight: 1.5 }}>
            Nothing yet. Ananya writes after she has read your answers.
          </p>
        ) : null}

        {sofar.map((m, i) =>
          m.from === "guide" ? (
            <div
              key={`${m.day}-${i}`}
              style={{
                alignSelf: "flex-start",
                maxWidth: "84%",
                background: "rgba(217,205,180,.5)",
                borderRadius: "14px 14px 14px 4px",
                padding: "9px 12px",
              }}
            >
              <p style={{ fontSize: 11, color: "#2f3a33", lineHeight: 1.45 }}>
                {m.text}
              </p>
              <p style={{ fontSize: 8, color: "#8d958e", marginTop: 4 }}>
                {guide.name.split(" ")[0]} · Day {m.day}
              </p>
            </div>
          ) : (
            <div
              key={`${m.day}-${i}`}
              style={{
                alignSelf: "flex-end",
                maxWidth: "82%",
                background: "var(--vetiver)",
                borderRadius: "14px 14px 4px 14px",
                padding: "9px 12px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--bone)",
                  lineHeight: 1.45,
                }}
              >
                {m.text}
              </p>
              <p
                style={{
                  fontSize: 8,
                  color: "rgba(217,205,180,.6)",
                  marginTop: 4,
                }}
              >
                You · Day {m.day}
              </p>
            </div>
          ),
        )}

        {showChange && change ? (
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(169,132,72,.16)",
              border: "1px solid rgba(169,132,72,.35)",
              borderRadius: 12,
              padding: "8px 11px",
              marginTop: 2,
            }}
          >
            <p
              className="cap"
              style={{ color: "var(--deepbrass)", fontSize: 7.5 }}
            >
              Plan updated · Day {changeDay.day}
            </p>
            <p style={{ fontSize: 10, color: "#4e574f", marginTop: 3 }}>
              {change.label} · {changeDay.weekday}days
            </p>
          </div>
        ) : null}

        <p
          style={{
            fontSize: 9,
            color: "#9aa29b",
            lineHeight: 1.5,
            paddingTop: 14,
          }}
        >
          {redFlagRule}
        </p>

        {/* Pinned to the foot of the thread: at the bottom when the month is
            young and few things have been said, stuck there once it is long. */}
        <div
          className="sticky"
          style={{
            marginTop: "auto",
            bottom: 0,
            background: "var(--bone)",
            paddingBottom: 86,
          }}
        >
          <div
            className="flex items-center"
            style={{
              gap: 8,
              borderTop: "1px solid rgba(169,132,72,.28)",
              paddingTop: 12,
            }}
          >
            <input
              disabled
              placeholder={`Write to ${guide.name.split(" ")[0]}`}
              aria-label={`Write to ${guide.name} — not available in the demo`}
              style={{
                flex: 1,
                border: "1px solid rgba(169,132,72,.35)",
                borderRadius: 999,
                padding: "9px 13px",
                fontSize: 10.5,
                color: "#9aa29b",
                background: "transparent",
              }}
            />
            <span
              aria-hidden="true"
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--ink)",
                color: "var(--bone)",
                fontSize: 12,
                flex: "0 0 34px",
              }}
            >
              ↑
            </span>
          </div>

          <p
            className="text-center"
            style={{ fontSize: 9, color: "#9aa29b", marginTop: 9 }}
          >
            The private line is for admin, not advice
          </p>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}
