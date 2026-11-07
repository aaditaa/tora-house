import Link from "next/link";

import { Disclaimer, Screen } from "@/components/demo/Bits";
import { actions, baselineIsNotAPillar, pillars } from "@/lib/demo-data";

export default function PlanPage() {
  return (
    <Screen
      eyebrow="Your plan"
      title="Five pillars, one plan."
      lede="Written from your readings, not from a template. Revisited every six to eight weeks."
    >
      <div className="flex flex-col border-t border-rule">
        {pillars.map((pillar) => {
          const mine = actions.filter((a) => a.pillarId === pillar.id);
          return (
            <details key={pillar.id} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex flex-col gap-1">
                  <span className="t-h3">{pillar.name}</span>
                  <span className="t-meta text-fg-muted">{pillar.holds}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative mt-2 h-3 w-3 flex-none text-fg-muted"
                >
                  <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current group-open:hidden" />
                </span>
              </summary>

              <ul className="flex flex-col pb-3">
                {mine.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/demo/plan/${a.id}`}
                      className="flex items-start justify-between gap-4 border-t border-rule py-3"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="t-body">{a.label}</span>
                        <span className="t-meta text-fg-muted">
                          {a.frequency}
                        </span>
                      </span>
                      <span className="t-eyebrow flex-none pt-1">
                        {a.resource}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>

      <p className="t-meta text-fg-muted">{baselineIsNotAPillar}</p>

      <Disclaimer compact />
    </Screen>
  );
}
