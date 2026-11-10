"use client";

import { Board, CornerCap, TabBar } from "@/components/demo/Board";
import {
  DEMO_MONTH,
  calendar,
  fixedDaily,
  guide,
  messages,
  selfReported,
  selfReportedMeasures,
  weeks,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

/**
 * The three measures the poster puts on the front. The rest of the seven stay
 * on the report; these are the ones she named when she came in.
 */
const HEADLINE = [
  { measure: "Sleep quality", label: "Sleep, as you rate it" },
  { measure: "Pain and physical comfort", label: "Knees on the stairs" },
  { measure: "Energy", label: "Energy through the day" },
] as const;

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

  const kept = byWeek.reduce(
    (acc, w) => ({ done: acc.done + w.done, total: acc.total + w.total }),
    { done: 0, total: 0 },
  );
  const keptPercent = kept.total
    ? Math.round((kept.done / kept.total) * 100)
    : 0;

  const reports = selfReported.filter((r) => r.day <= state.day);
  const first = reports[0];
  const latest = reports[reports.length - 1];

  const lastFromGuide = messages
    .filter((m) => m.from === "guide" && m.day <= state.day)
    .at(-1);

  return (
    <Board ground="sand" style={{ padding: "56px 0 0" }}>
      <div className="relative" style={{ height: 10 }}>
        <CornerCap side="left">
          <span style={{ color: "var(--deepbrass)" }}>
            Day {state.day} of {DEMO_MONTH.days}
          </span>
        </CornerCap>
        <CornerCap side="right">
          <span style={{ color: "rgba(23,33,28,.4)" }}>
            {DEMO_MONTH.label.split(" ")[0]}
          </span>
        </CornerCap>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        <h1
          className="dp"
          style={{ fontSize: 26, color: "var(--ink)", lineHeight: 1.16 }}
        >
          How the month
          <br />
          <i>is going</i>
        </h1>
      </div>

      <div style={{ padding: "18px 20px 0" }}>
        <div
          style={{
            background: "var(--bone)",
            borderRadius: 15,
            padding: "14px 14px 16px",
          }}
        >
          <span
            className="trk"
            style={{ fontSize: 8, color: "var(--deepbrass)" }}
          >
            What you kept
          </span>

          <div
            className="flex items-end"
            style={{ gap: 5, height: 58, marginTop: 12 }}
            aria-hidden="true"
          >
            {byWeek.map((w, i) => {
              const share = i / byWeek.length;
              const fill =
                share < 1 / 3
                  ? "var(--sand)"
                  : share < 2 / 3
                    ? "var(--brass)"
                    : "var(--vetiver)";
              const height = w.total
                ? Math.max(4, Math.round((w.done / w.total) * 100))
                : 0;

              return (
                <span
                  key={w.week}
                  className="flex flex-col justify-end"
                  style={{
                    flex: 1,
                    height: "100%",
                    background: "rgba(23,33,28,.07)",
                    borderRadius: 2,
                  }}
                >
                  {w.started && w.done > 0 ? (
                    <span
                      style={{
                        background: fill,
                        height: `${height}%`,
                        borderRadius: 2,
                      }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>

          <div
            className="trk flex justify-between"
            style={{ marginTop: 8, fontSize: 7.5, color: "#8a918a" }}
          >
            {byWeek.map((w) => (
              <span key={w.week}>W{w.week}</span>
            ))}
          </div>

          <p
            style={{
              fontSize: 9,
              color: "#8a918a",
              marginTop: 10,
              lineHeight: 1.5,
            }}
          >
            {byWeek.filter((w) => w.started).length} of {weeks.length} weeks
            begun. Counted from what you ticked, not from what was planned.
          </p>
        </div>
      </div>

      <div style={{ padding: "14px 20px 0" }}>
        {HEADLINE.map(({ measure, label }) => {
          const i = selfReportedMeasures.indexOf(measure);
          return (
            <Row key={measure} label={label}>
              {first && latest && i >= 0 ? (
                reports.length > 1 ? (
                  <>
                    {first.scores[i]}{" "}
                    <span style={{ color: "var(--brass)", fontSize: 11 }}>
                      →
                    </span>{" "}
                    {latest.scores[i]}
                  </>
                ) : (
                  <>{first.scores[i]}</>
                )
              ) : (
                <span style={{ fontSize: 11, color: "#8a918a" }}>Not yet</span>
              )}
            </Row>
          );
        })}

        <Row label="Routine kept" last>
          {keptPercent}%
        </Row>

        <p
          style={{
            fontSize: 9,
            color: "rgba(23,33,28,.45)",
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          Out of five, and your own answer each time. You fill these in on Days{" "}
          {selfReported.map((r) => r.day).join(", ")}
          {reports.length < selfReported.length
            ? ` — Day ${selfReported[reports.length]!.day} is still ahead of you.`
            : "."}
        </p>
      </div>

      <div style={{ marginTop: "auto", padding: "0 20px 86px" }}>
        {lastFromGuide ? (
          <div
            className="flex items-center"
            style={{
              border: "1px solid rgba(169,132,72,.5)",
              borderRadius: 13,
              padding: "11px 12px",
              gap: 10,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(140deg,#b9a583,#6f5c3f)",
                flex: "0 0 26px",
              }}
            />
            <p
              style={{
                flex: 1,
                fontSize: 10,
                color: "#4e574f",
                lineHeight: 1.45,
              }}
            >
              “{lastFromGuide.text}” — {guide.name.split(" ")[0]}, Day{" "}
              {lastFromGuide.day}
            </p>
          </div>
        ) : null}
      </div>

      <TabBar lt />
    </Board>
  );
}

function Row({
  label,
  last = false,
  children,
}: {
  label: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        borderTop: "1px solid rgba(23,33,28,.16)",
        borderBottom: last ? "1px solid rgba(23,33,28,.16)" : undefined,
        padding: "11px 0",
      }}
    >
      <span style={{ fontSize: 11.5, color: "var(--ink)" }}>{label}</span>
      <span className="dp" style={{ fontSize: 14, color: "var(--ink)" }}>
        {children}
      </span>
    </div>
  );
}
