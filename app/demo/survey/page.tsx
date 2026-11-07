"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Screen } from "@/components/demo/Bits";
import {
  surveyClosing,
  surveyQuestions,
  type SurveyQuestion,
} from "@/lib/demo-data";
import { useDemo } from "@/lib/demo-state";

export default function SurveyPage() {
  const { state, hydrated, setAnswer, set } = useDemo();
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const total = surveyQuestions.length;
  const done = index >= total;
  const question = done ? undefined : surveyQuestions[index]!;

  // Seed Meera's answers once, so the form opens filled but every field is hers
  // to change. Done after hydration so the server and client agree on first paint.
  useEffect(() => {
    if (!hydrated || Object.keys(state.answers).length > 0) return;
    const seeded: Record<string, unknown> = {};
    for (const q of surveyQuestions) seeded[q.id] = q.prefill;
    set({ answers: seeded });
  }, [hydrated, state.answers, set]);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [index]);

  function go(delta: number) {
    moved.current = true;
    setIndex((i) => Math.min(Math.max(i + delta, 0), total));
  }

  if (done) return <Summary onBack={() => go(-1)} />;

  return (
    <Screen
      footer={
        <div className="flex items-center gap-3">
          {index > 0 ? (
            <button
              type="button"
              className="btn btn-quiet flex-1"
              onClick={() => go(-1)}
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={() => go(1)}
          >
            {index === total - 1 ? "Finish" : "Next"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex gap-1" aria-hidden="true">
          {surveyQuestions.map((q, i) => (
            <span
              key={q.id}
              className={`h-px flex-1 ${i <= index ? "bg-brass" : "bg-rule"}`}
            />
          ))}
        </div>
        <p className="t-eyebrow">
          {question!.section} · {index + 1} of {total}
        </p>
      </div>

      <h1 ref={headingRef} tabIndex={-1} className="t-h3">
        {question!.prompt}
      </h1>

      {question!.note ? (
        <p className="t-meta text-fg-muted">{question!.note}</p>
      ) : null}

      <Field
        question={question!}
        value={state.answers[question!.id]}
        onChange={(v) => setAnswer(question!.id, v)}
      />

      {question!.optional ? (
        <p className="t-meta text-fg-muted">Optional.</p>
      ) : null}
    </Screen>
  );
}

function Field({
  question,
  value,
  onChange,
}: {
  question: SurveyQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `q-${question.id}`;

  switch (question.type) {
    case "text":
    case "number":
      return (
        <input
          id={id}
          className="field-input"
          type={question.type === "number" ? "number" : "text"}
          inputMode={question.type === "number" ? "numeric" : "text"}
          value={String(value ?? "")}
          onChange={(e) =>
            onChange(
              question.type === "number"
                ? Number(e.target.value)
                : e.target.value,
            )
          }
        />
      );

    case "longText":
      return (
        <textarea
          id={id}
          className="field-input"
          rows={5}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "count":
      return (
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <Choice key={n} selected={value === n} onClick={() => onChange(n)}>
              {n}
            </Choice>
          ))}
        </div>
      );

    case "single":
      return (
        <div className="flex flex-col gap-2">
          {question.options!.map((o) => (
            <Choice
              key={o}
              wide
              selected={value === o}
              onClick={() => onChange(o)}
            >
              {o}
            </Choice>
          ))}
        </div>
      );

    case "multi": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-col gap-2">
          {question.options!.map((o) => {
            const on = list.includes(o);
            return (
              <Choice
                key={o}
                wide
                selected={on}
                onClick={() =>
                  onChange(on ? list.filter((v) => v !== o) : [...list, o])
                }
              >
                {o}
              </Choice>
            );
          })}
        </div>
      );
    }

    case "scale": {
      const max = question.scaleMax ?? 5;
      return (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <Choice
                key={n}
                selected={value === n}
                onClick={() => onChange(n)}
                grow
              >
                {n}
              </Choice>
            ))}
          </div>
          {question.scaleLabels ? (
            <div className="flex justify-between">
              <span className="t-eyebrow">{question.scaleLabels[0]}</span>
              <span className="t-eyebrow">{question.scaleLabels[1]}</span>
            </div>
          ) : null}
        </div>
      );
    }

    case "timePair": {
      const pair = (value ?? { bed: "", wake: "" }) as {
        bed: string;
        wake: string;
      };
      return (
        <div className="flex gap-4">
          <label className="flex flex-1 flex-col gap-2">
            <span className="t-meta font-medium">To bed</span>
            <input
              className="field-input"
              type="time"
              value={pair.bed}
              onChange={(e) => onChange({ ...pair, bed: e.target.value })}
            />
          </label>
          <label className="flex flex-1 flex-col gap-2">
            <span className="t-meta font-medium">Awake</span>
            <input
              className="field-input"
              type="time"
              value={pair.wake}
              onChange={(e) => onChange({ ...pair, wake: e.target.value })}
            />
          </label>
        </div>
      );
    }
  }
}

function Choice({
  children,
  selected,
  onClick,
  wide,
  grow,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  wide?: boolean;
  grow?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`t-meta border px-4 py-3 text-left transition-colors duration-200 ${
        wide ? "w-full" : ""
      } ${grow ? "flex-1 text-center" : ""} ${
        selected ? "border-ink bg-ink text-bone" : "border-rule text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Summary({ onBack }: { onBack: () => void }) {
  const { state } = useDemo();

  const shown = useMemo(
    () => surveyQuestions.filter((q) => q.core).slice(0, 8),
    [],
  );

  return (
    <Screen
      eyebrow="That's everything"
      title="What you told us."
      lede={surveyClosing}
      footer={
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-quiet flex-1"
            onClick={onBack}
          >
            Back
          </button>
          <Link href="/demo/journey" className="btn btn-primary flex-1">
            Continue
          </Link>
        </div>
      }
    >
      <dl className="flex flex-col">
        {shown.map((q) => (
          <div
            key={q.id}
            className="flex flex-col gap-1 border-b border-rule py-3.5 last:border-b-0"
          >
            <dt className="t-eyebrow">{q.prompt}</dt>
            <dd className="t-body">{render(state.answers[q.id])}</dd>
          </div>
        ))}
      </dl>
    </Screen>
  );
}

function render(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    const p = value as { bed?: string; wake?: string };
    return p.bed ? `${p.bed} to ${p.wake}` : "—";
  }
  return String(value);
}
