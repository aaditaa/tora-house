"use client";

import Link from "next/link";

import { Screen } from "@/components/demo/Bits";
import { DEMO_MONTH, dayFor, fixedDaily, member, weeks } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

export default function TodayPage() {
  const { state, hydrated, toggleTick, isTicked } = useDemo();
  const day = dayFor(state.day);
  const week = weeks.find((w) => w.week === day.week)!;

  const items = [
    ...fixedDaily.map((f) => ({ ...f, kind: "routine" as const, fixed: true })),
    ...day.added.map((a) => ({ ...a, fixed: false })),
  ];

  const ticked = items.filter(
    (i) => hydrated && isTicked(state.day, i.id),
  ).length;

  return (
    <Screen
      eyebrow={`${day.weekday} ${day.day} December · Week ${day.week}`}
      title={`Good morning, ${member.firstName}.`}
      lede={week.theme}
    >
      <ul className="flex flex-col border-t border-rule">
        {items.map((item) => {
          const on = hydrated && isTicked(state.day, item.id);
          const special = item.kind !== "routine" && item.kind !== "rest";
          return (
            <li
              key={`${item.id}-${item.label}`}
              className="border-b border-rule"
            >
              <label className="flex cursor-pointer items-start gap-3.5 py-3.5">
                <input
                  type="checkbox"
                  className="demo-tick mt-0.5"
                  checked={on}
                  onChange={() => toggleTick(state.day, item.id)}
                />
                <span className="flex flex-col gap-1">
                  <span
                    className={`t-body ${on ? "text-fg-muted line-through" : ""}`}
                  >
                    {item.label}
                  </span>
                  {special ? (
                    <span
                      className="t-eyebrow"
                      style={{ color: "var(--accent-type)" }}
                    >
                      {item.kind === "immersion"
                        ? "Immersion"
                        : item.kind === "checkIn"
                          ? "With Ananya"
                          : "Self-assessment"}
                    </span>
                  ) : item.fixed ? (
                    <span className="t-eyebrow">Every day</span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="t-meta text-fg-muted">
        {ticked} of {items.length} done. Nothing is scored, and a missed day is
        just a missed day.
      </p>

      <Link href="/demo/calendar" className="t-meta link">
        See the whole of {DEMO_MONTH.label}
      </Link>
    </Screen>
  );
}
