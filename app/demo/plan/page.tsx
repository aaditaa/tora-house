import Link from "next/link";

import { Disclaimer, Screen } from "@/components/demo/Bits";
import {
  actions,
  baselineIsNotAPillar,
  pillarPreferenceNote,
  pillars,
  recoveryDetail,
  type Pillar,
} from "@/lib/demo-data";

const byPreference = [...pillars].sort((a, b) => a.preference - b.preference);

export default function PlanPage() {
  return (
    <Screen
      eyebrow="Your plan"
      title="Five pillars, one plan."
      lede="Written from your readings, not from a template. Revisited every six to eight weeks."
    >
      <div className="flex flex-col gap-2">
        <p className="t-eyebrow">Your order</p>
        <p className="t-meta text-fg-muted">{pillarPreferenceNote}</p>
      </div>

      <div className="flex flex-col border-t border-rule">
        {byPreference.map((pillar) => (
          <PillarRow key={pillar.id} pillar={pillar} />
        ))}
      </div>

      <p className="t-meta text-fg-muted">{baselineIsNotAPillar}</p>

      <Disclaimer compact />
    </Screen>
  );
}

function PillarRow({ pillar }: { pillar: Pillar }) {
  const mine = actions.filter((a) => a.pillarId === pillar.id);

  return (
    <details className="demo-pillar group border-b border-rule">
      <summary className="flex cursor-pointer list-none items-start gap-3.5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="demo-pillar-rank" aria-hidden="true">
          {String(pillar.preference).padStart(2, "0")}
        </span>

        <span className="flex flex-1 flex-col gap-1.5">
          <span className="t-h3">{pillar.name}</span>
          <span className="t-meta text-fg-muted">{pillar.holds}</span>
          {pillar.goal ? (
            <span className="demo-goal-line">
              <span className="t-eyebrow text-[0.5rem]">Goal</span>
              <span className="t-meta">{pillar.goal}</span>
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className="relative mt-2 h-3 w-3 flex-none text-fg-muted"
        >
          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current group-open:hidden" />
        </span>
      </summary>

      <div className="flex flex-col gap-5 pb-5">
        <Block label={`Why it is number ${pillar.preference}`}>
          <p className="t-meta text-fg-muted">{pillar.chosenBecause}</p>
        </Block>

        <Block label={`In her plan · ${mine.length}`}>
          <ul className="flex flex-col border-t border-rule">
            {mine.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/demo/plan/${a.id}`}
                  className="flex items-start justify-between gap-4 border-b border-rule py-3"
                >
                  <span className="flex flex-col gap-1">
                    <span className="t-body">{a.label}</span>
                    <span className="t-meta text-fg-muted">{a.frequency}</span>
                  </span>
                  <span className="t-eyebrow flex-none pt-1">{a.resource}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        {pillar.id === "recovery" ? <RecoveryDetail /> : null}
      </div>
    </details>
  );
}

/** The one pillar that is asked to be specific about what it will and will not do. */
function RecoveryDetail() {
  return (
    <>
      <Block label="What it holds, for her two">
        <ul className="flex flex-col border-t border-rule">
          {recoveryDetail.forHer.map((e) => (
            <li
              key={e.what}
              className="flex flex-col gap-0.5 border-b border-rule py-2.5"
            >
              <span className="t-meta">{e.what}</span>
              <span className="t-eyebrow text-[0.5rem]">{e.why}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Already a daily habit">
        <ul className="flex flex-col gap-2">
          {recoveryDetail.inHerDay.map((line) => (
            <li key={line} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.5em] h-px w-3 flex-none bg-brass"
              />
              <span className="t-meta text-fg-muted">{line}</span>
            </li>
          ))}
        </ul>
      </Block>

      <div className="grid gap-5">
        <Block label="What we do">
          <Rules lines={recoveryDetail.weDo} />
        </Block>
        <Block label="What we never do">
          <Rules lines={recoveryDetail.weDoNot} />
        </Block>
      </div>
    </>
  );
}

function Rules({ lines }: { lines: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {lines.map((line) => (
        <li key={line} className="t-meta text-fg-muted">
          {line}
        </li>
      ))}
    </ul>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="t-eyebrow" style={{ color: "var(--accent-type)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}
