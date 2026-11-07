"use client";

import { useState } from "react";

import { Screen } from "@/components/demo/Bits";
import {
  DEMO_MONTH,
  calendar,
  dayFor,
  fixedDaily,
  travelRule,
  weeks,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

const COLUMNS = ["M", "T", "W", "T", "F", "S", "S"];

export default function CalendarPage() {
  const { state, set } = useDemo();
  const [open, setOpen] = useState<number | null>(null);
  const selected = open ?? state.day;
  const day = dayFor(selected);

  return (
    <Screen eyebrow={DEMO_MONTH.label} title="Your month.">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-7 gap-1">
          {COLUMNS.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="t-eyebrow text-center text-[0.5625rem]"
            >
              {c}
            </span>
          ))}

          {Array.from({ length: DEMO_MONTH.firstColumn - 1 }, (_, i) => (
            <span key={`pad-${i}`} aria-hidden="true" />
          ))}

          {calendar.map((d) => {
            const isSelected = d.day === selected;
            const isToday = d.day === state.day;
            const immersion = d.kinds.includes("immersion");
            const checkIn = d.kinds.includes("checkIn");
            const assessment = d.kinds.includes("assessment");
            const rest = d.kinds.includes("rest");

            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setOpen(d.day)}
                aria-pressed={isSelected}
                aria-label={`${d.weekday} ${d.day} December`}
                className={`flex aspect-square flex-col items-center justify-center gap-1 border transition-colors duration-200 ${
                  isSelected ? "border-ink bg-ink text-bone" : "border-rule"
                }`}
              >
                <span className="t-meta text-[0.75rem] leading-none">
                  {d.day}
                </span>
                <span
                  className="flex h-1 items-center gap-0.5"
                  aria-hidden="true"
                >
                  {immersion ? <Dot on={isSelected} shape="ring" /> : null}
                  {checkIn ? <Dot on={isSelected} /> : null}
                  {assessment ? <Dot on={isSelected} shape="bar" /> : null}
                  {rest && !immersion ? (
                    <Dot on={isSelected} shape="hollow" />
                  ) : null}
                </span>
                {isToday ? (
                  <span aria-hidden="true" className="sr-only">
                    today
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          <Key shape="ring">Immersion</Key>
          <Key>Check-in</Key>
          <Key shape="bar">Self-assessment</Key>
          <Key shape="hollow">Rest</Key>
        </ul>
      </div>

      <div className="flex flex-col gap-4 bg-sand p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="t-h3">
            {day.weekday} {day.day} December
          </p>
          <p className="t-eyebrow">Week {day.week}</p>
        </div>
        <p className="t-meta text-fg-muted">
          {weeks.find((w) => w.week === day.week)!.theme}
        </p>

        <ul className="flex flex-col gap-2">
          {day.added.map((a) => (
            <li key={`${a.id}-${a.label}`} className="t-meta">
              {a.label}
            </li>
          ))}
        </ul>

        <p className="t-eyebrow">Plus every day</p>
        <ul className="flex flex-col gap-1">
          {fixedDaily.map((f) => (
            <li key={f.id} className="t-meta text-fg-muted">
              {f.label}
            </li>
          ))}
        </ul>

        {day.day !== state.day ? (
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              set({ day: day.day });
              setOpen(null);
            }}
          >
            Make this today
          </button>
        ) : null}
      </div>

      <p className="t-meta text-fg-muted">{travelRule}</p>
    </Screen>
  );
}

function Dot({
  on,
  shape = "solid",
}: {
  on: boolean;
  shape?: "solid" | "ring" | "bar" | "hollow";
}) {
  const colour = on ? "var(--bone)" : "var(--brass)";
  if (shape === "bar") {
    return (
      <span className="block h-0.5 w-2" style={{ backgroundColor: colour }} />
    );
  }
  if (shape === "ring" || shape === "hollow") {
    return (
      <span
        className="block h-1.5 w-1.5 rounded-full border"
        style={{
          borderColor: colour,
          backgroundColor: shape === "ring" ? colour : "transparent",
        }}
      />
    );
  }
  return (
    <span
      className="block h-1 w-1 rounded-full"
      style={{ backgroundColor: colour }}
    />
  );
}

function Key({
  children,
  shape,
}: {
  children: string;
  shape?: "ring" | "bar" | "hollow";
}) {
  return (
    <li className="flex items-center gap-1.5">
      <Dot on={false} shape={shape ?? "solid"} />
      <span className="t-eyebrow text-[0.5625rem]">{children}</span>
    </li>
  );
}
