import Link from "next/link";

import { Screen } from "@/components/demo/Bits";
import { journeySteps } from "@/lib/demo-data";

const STATE_LABEL = {
  done: "Done",
  now: "Now",
  waiting: "Next",
} as const;

export default function JourneyPage() {
  return (
    <Screen
      eyebrow="Your journey"
      title="Where you are."
      lede="Nothing is prescribed before you are measured. This is the order it happens in."
    >
      <ol className="flex flex-col">
        {journeySteps.map((step, i) => {
          const done = step.state === "done";
          const now = step.state === "now";
          return (
            <li
              key={step.id}
              className="flex gap-4 border-b border-rule py-4 last:border-b-0"
            >
              <span className="flex flex-none flex-col items-center gap-1 pt-1">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${
                    done ? "bg-ink" : now ? "bg-brass" : "border border-muted"
                  }`}
                />
                {i < journeySteps.length - 1 ? (
                  <span aria-hidden="true" className="w-px flex-1 bg-rule" />
                ) : null}
              </span>

              <Link href={step.href} className="flex w-full flex-col gap-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="t-h3">{step.label}</span>
                  <span className="t-eyebrow">{STATE_LABEL[step.state]}</span>
                </span>
                <span className="t-meta text-fg-muted">{step.detail}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}
