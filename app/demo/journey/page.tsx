import Link from "next/link";

import { Screen } from "@/components/demo/Bits";
import { journeySteps } from "@/lib/demo-data";

const STATE_LABEL = {
  done: "Done",
  now: "Now",
  waiting: "",
} as const;

/**
 * Her own screen, not an explanation of one: no lede telling her how the
 * programme is sequenced, because she is living it. The rail carries the order
 * and the step she is on is the only one with any weight.
 */
export default function JourneyPage() {
  const current = journeySteps.findIndex((s) => s.state === "now");

  return (
    <Screen eyebrow="Your journey" title="Where you are.">
      <ol className="demo-rail">
        {journeySteps.map((step, i) => (
          <li key={step.id} data-state={step.state} className="demo-rail-step">
            <span aria-hidden="true" className="demo-rail-mark" />
            {i < journeySteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="demo-rail-line"
                data-filled={i < current ? "true" : undefined}
              />
            ) : null}

            <Link href={step.href} className="demo-rail-body">
              <span className="flex items-baseline justify-between gap-3">
                <span className="t-h3">{step.label}</span>
                {STATE_LABEL[step.state] ? (
                  <span className="t-eyebrow flex-none text-[0.5rem]">
                    {STATE_LABEL[step.state]}
                  </span>
                ) : null}
              </span>
              <span className="t-meta text-fg-muted">{step.detail}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Screen>
  );
}
