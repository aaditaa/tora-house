"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Portrait, Screen } from "@/components/demo/Bits";
import {
  DEMO_MONTH,
  calendar,
  dayFor,
  fixedDaily,
  guide,
  immersions,
  member,
  surveyQuestions,
  weeks,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

/** Her one thing, as she said it on the call. */
const oneThing =
  surveyQuestions.find((q) => q.id === "oneThing")?.prefill ?? "";

export default function TodayPage() {
  const { state, hydrated, toggleTick, isTicked, set } = useDemo();
  const immersionDeck = useRef<HTMLDivElement>(null);
  const day = dayFor(state.day);
  const week = weeks.find((w) => w.week === day.week)!;

  const added = day.added;
  const everyDay = fixedDaily;
  const total = added.length + everyDay.length;
  const ticked = hydrated
    ? [...added, ...everyDay].filter((i) => isTicked(state.day, i.id)).length
    : 0;

  // The sections above this deck lift in on load, and the browser re-anchors the
  // deck while they settle — it opened on the second card. Put it back.
  useEffect(() => {
    const el = immersionDeck.current;
    if (!el) return;
    const settle = () => el.scrollTo({ left: 0, behavior: "instant" });
    const frame = requestAnimationFrame(settle);
    const t = window.setTimeout(settle, 650);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t);
    };
  }, []);

  const upcoming = immersions.filter((i) => i.state === "upcoming");
  const next = upcoming.find((i) => (i.day ?? 0) >= state.day) ?? upcoming[0];

  // What is still ahead of her leads, so the first card is the one the line
  // above it names. Then what has gone by, then what she has already been to.
  const deck = [
    ...upcoming.filter((i) => (i.day ?? 0) >= state.day),
    ...upcoming.filter((i) => (i.day ?? 0) < state.day),
    ...immersions.filter((i) => i.state !== "upcoming"),
  ];

  return (
    <Screen>
      <DayStrip day={state.day} onPick={(d) => set({ day: d })} />

      <header className="demo-rise flex flex-col gap-3">
        <hr className="rule-brass" />
        <p className="t-eyebrow">
          {day.weekday} {day.day} December · Week {day.week}
        </p>
        <h1 className="t-h2">Good morning, {member.firstName}.</h1>
        <p className="t-body text-fg-muted">{week.theme}</p>
      </header>

      {/* Her one goal. The reason the rest of the screen exists. */}
      <section
        className="demo-rise demo-goal flex items-center gap-4"
        style={{ animationDelay: "60ms" }}
      >
        <span aria-hidden="true" className="demo-breath" />
        <div className="flex flex-col gap-1.5">
          <p className="t-eyebrow" style={{ color: "var(--accent-type)" }}>
            The one thing
          </p>
          <p className="t-h3">{String(oneThing)}</p>
          <p className="t-meta text-fg-muted">
            You said: &ldquo;{member.inHerWords}&rdquo;
          </p>
        </div>
      </section>

      {/* Today's practice — one part of the screen, not all of it. */}
      <section
        className="demo-rise flex flex-col gap-3.5"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="t-eyebrow">Today&rsquo;s practice</h2>
          <p className="t-eyebrow text-fg-muted">
            {ticked} / {total}
          </p>
        </div>

        <div
          className="h-px w-full bg-rule"
          role="progressbar"
          aria-valuenow={ticked}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Done today"
        >
          <div
            className="demo-progress h-px bg-brass"
            style={{ width: `${total ? (ticked / total) * 100 : 0}%` }}
          />
        </div>

        {added.length > 0 ? (
          <ul className="flex flex-col border-t border-rule">
            {added.map((item) => (
              <Tick
                key={item.id}
                id={item.id}
                label={item.label}
                note={
                  item.kind === "immersion"
                    ? "Immersion"
                    : item.kind === "checkIn"
                      ? `With ${guide.name.split(" ")[0]}`
                      : item.kind === "assessment"
                        ? "Self-assessment"
                        : undefined
                }
                accent
                day={state.day}
                on={hydrated && isTicked(state.day, item.id)}
                onToggle={() => toggleTick(state.day, item.id)}
              />
            ))}
          </ul>
        ) : null}

        <details className="demo-fold">
          <summary className="t-eyebrow">Every day · {everyDay.length}</summary>
          <ul className="flex flex-col border-t border-rule">
            {everyDay.map((item) => (
              <Tick
                key={item.id}
                id={item.id}
                label={item.label}
                day={state.day}
                on={hydrated && isTicked(state.day, item.id)}
                onToggle={() => toggleTick(state.day, item.id)}
              />
            ))}
          </ul>
        </details>

        <p className="t-meta text-fg-muted">
          Nothing is scored, and a missed day is just a missed day.
        </p>
      </section>

      {/* Her guide. */}
      <Link
        href="/demo/guide"
        className="demo-rise flex items-center gap-3.5 border-y border-rule py-3.5"
        style={{ animationDelay: "180ms" }}
      >
        <Portrait initials={guide.initials} size={44} label={guide.name} />
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="t-meta font-medium">{guide.name}</span>
          <span className="t-eyebrow">{guide.role} · Message her</span>
        </span>
        <span aria-hidden="true" className="t-meta text-fg-muted">
          &rarr;
        </span>
      </Link>

      {/* Immersions, swipeable. */}
      <section
        className="demo-rise flex flex-col gap-3.5"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="t-eyebrow">Immersions</h2>
          {next ? (
            <p className="t-meta text-fg-muted">Next on {next.when}</p>
          ) : null}
        </div>

        <div
          ref={immersionDeck}
          className="demo-deck demo-deck-tight"
          tabIndex={0}
          role="group"
          aria-label="Immersions"
        >
          {deck.map((im) => (
            <article key={im.id} className="demo-card demo-card-sm">
              <span className="demo-card-figure">
                <Image
                  src={im.image}
                  alt={im.alt}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <p
                  className="t-eyebrow"
                  style={{ color: "var(--accent-type)" }}
                >
                  {im.when}
                </p>
                <span className="demo-chip">
                  {im.state === "attended" ? "Attended" : "Upcoming"}
                </span>
              </div>
              <p className="t-h3">{im.title}</p>
              <p className="t-meta text-fg-muted">{im.detail}</p>
            </article>
          ))}
        </div>

        <Link href="/demo/immersions" className="t-meta link">
          All immersions
        </Link>
      </section>

      <Link href="/demo/calendar" className="t-meta link">
        See the whole of {DEMO_MONTH.label}
      </Link>
    </Screen>
  );
}

function Tick({
  id,
  label,
  note,
  accent,
  day,
  on,
  onToggle,
}: {
  id: string;
  label: string;
  note?: string;
  accent?: boolean;
  day: number;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="border-b border-rule" key={`${day}-${id}`}>
      <label className="flex cursor-pointer items-start gap-3.5 py-3.5">
        <input
          type="checkbox"
          className="demo-tick mt-0.5"
          checked={on}
          onChange={onToggle}
        />
        <span className="flex flex-col gap-1">
          <span className={`t-body ${on ? "text-fg-muted line-through" : ""}`}>
            {label}
          </span>
          {note ? (
            <span
              className="t-eyebrow"
              style={accent ? { color: "var(--accent-type)" } : undefined}
            >
              {note}
            </span>
          ) : null}
        </span>
      </label>
    </li>
  );
}

/** Thirty days, swipeable, with today held in the middle. */
function DayStrip({
  day,
  onPick,
}: {
  day: number;
  onPick: (d: number) => void;
}) {
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = strip.current;
    const active = el?.querySelector<HTMLElement>('[data-on="true"]');
    if (!el || !active) return;
    el.scrollTo({
      left: active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [day]);

  return (
    <div
      ref={strip}
      className="demo-strip"
      role="group"
      aria-label={`Day of ${DEMO_MONTH.label}`}
    >
      {calendar.map((d) => {
        const on = d.day === day;
        return (
          <button
            key={d.day}
            type="button"
            data-on={on}
            aria-current={on ? "date" : undefined}
            aria-label={`${d.weekday} ${d.day} December`}
            onClick={() => onPick(d.day)}
            className={`demo-day ${on ? "demo-day-on" : ""}`}
          >
            <span className="t-eyebrow text-[0.5rem]">{d.weekday}</span>
            <span className="t-numeral text-[0.875rem]">{d.day}</span>
            <span
              aria-hidden="true"
              className={`h-px w-2.5 ${
                d.kinds.some((k) => k !== "routine" && k !== "rest")
                  ? "bg-brass"
                  : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
