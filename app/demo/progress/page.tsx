"use client";

import { Screen } from "@/components/demo/Bits";
import {
  calendar,
  fixedDaily,
  selfReported,
  selfReportedMeasures,
  weeks,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

export default function ProgressPage() {
  const { state, hydrated } = useDemo();

  // Completion is counted only up to the day the demo is on. Showing four full
  // weeks on Day 1 would be inventing a month she has not lived.
  const byWeek = weeks.map((w) => {
    const days = calendar.filter(
      (d) => d.week === w.week && d.day <= state.day,
    );
    let total = 0;
    let done = 0;
    for (const d of days) {
      const items = [
        ...fixedDaily.map((f) => f.id),
        ...d.added.map((a) => a.id),
      ];
      total += items.length;
      const ticks = hydrated ? (state.ticks[String(d.day)] ?? []) : [];
      done += items.filter((id) => ticks.includes(id)).length;
    }
    return { ...w, total, done, started: days.length > 0 };
  });

  const reports = selfReported.filter((r) => r.day <= state.day);

  return (
    <Screen
      eyebrow="Progress"
      title="How the month is going."
      lede="Nothing here is a score. It is a record you and Ananya read together."
    >
      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">Completion</p>
        {byWeek.map((w) => (
          <div
            key={w.week}
            className="flex flex-col gap-2 border-b border-rule py-3.5 last:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="t-body">Week {w.week}</span>
              <span className="t-meta text-fg-muted">
                {w.started ? `${w.done} of ${w.total}` : "Not yet"}
              </span>
            </div>
            <span aria-hidden="true" className="block h-px w-full bg-rule">
              <span
                className="block h-px bg-brass"
                style={{
                  width: w.total ? `${(w.done / w.total) * 100}%` : "0%",
                }}
              />
            </span>
            <span className="t-eyebrow text-[0.5625rem]">{w.theme}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="t-eyebrow">How you have felt</p>
        <p className="t-meta text-fg-muted">
          You answer these yourself on Days 1, 15 and 30. Illustrative, and out
          of five.
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="t-eyebrow pb-2 text-left text-[0.5625rem]">
                Measure
              </th>
              {reports.map((r) => (
                <th
                  key={r.day}
                  className="t-eyebrow pb-2 text-right text-[0.5625rem]"
                >
                  Day {r.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selfReportedMeasures.map((m, i) => (
              <tr key={m} className="border-t border-rule">
                <td className="t-meta py-2.5 pr-3">{m}</td>
                {reports.map((r) => (
                  <td key={r.day} className="t-meta py-2.5 text-right">
                    {r.scores[i]} / 5
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length < selfReported.length ? (
          <p className="t-meta text-fg-muted">
            Day {selfReported[reports.length]!.day} is still ahead of you.
          </p>
        ) : null}
      </div>
    </Screen>
  );
}
