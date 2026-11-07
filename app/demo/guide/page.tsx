"use client";

import { Portrait, Screen } from "@/components/demo/Bits";
import { calendar, guide, messages, redFlagRule } from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

export default function GuidePage() {
  const { state } = useDemo();

  // Only what has been said by the day the demo is on. The thread grows as the
  // month is walked rather than showing her a future she has not had yet.
  const sofar = messages.filter((m) => m.day <= state.day);
  const nextCheckIn = calendar.find(
    (d) => d.day >= state.day && d.kinds.includes("checkIn"),
  );

  return (
    <Screen eyebrow="Your guide" title={guide.name}>
      <div className="flex items-center gap-4">
        <Portrait
          initials={guide.initials}
          size={56}
          label={`${guide.name}, placeholder portrait`}
        />
        <div className="flex flex-col gap-1">
          <p className="t-meta">{guide.credentials[0]}</p>
          <p className="t-eyebrow">
            {nextCheckIn
              ? `Next check-in · ${nextCheckIn.weekday} ${nextCheckIn.day} December`
              : "Month review complete"}
          </p>
        </div>
      </div>

      <button type="button" className="btn btn-primary w-full">
        Call Ananya
      </button>

      <div className="flex flex-col gap-3">
        {sofar.length === 0 ? (
          <p className="t-meta text-fg-muted">
            Nothing yet. Ananya writes after she has read your answers.
          </p>
        ) : null}

        {sofar.map((m, i) => (
          <div
            key={`${m.day}-${i}`}
            className={`flex flex-col gap-1 ${m.from === "member" ? "items-end" : "items-start"}`}
          >
            <span className="t-eyebrow text-[0.5625rem]">
              {m.from === "guide" ? guide.name : "You"} · Day {m.day}
            </span>
            <p
              className={`t-meta max-w-[85%] p-3.5 ${
                m.from === "guide" ? "bg-sand" : "border border-rule"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-l border-brass pl-4">
        <p className="t-eyebrow">If something is outside her remit</p>
        <p className="t-meta text-fg-muted">{redFlagRule}</p>
      </div>
    </Screen>
  );
}
