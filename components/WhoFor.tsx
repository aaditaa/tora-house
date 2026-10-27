import { Reveal } from "@/components/Reveal";
import { AGE_RANGE, CITY } from "@/lib/config";

const FOR_HER = [
  `You are a woman between ${AGE_RANGE.replace("–", " and ")}, in or around ${CITY}.`,
  "You can be in a room, in person, every two weeks.",
  "You have tried several things that ended, and you are tired of starting over.",
  "You would rather hand this to someone competent than keep running it yourself.",
];

const NOT_FOR_HER = [
  "You are training for a race, a climb or an event.",
  "You want a visible result inside six weeks.",
  "You want an app and a plan to follow on your own.",
  `You are outside ${AGE_RANGE}, or outside ${CITY} — a later chapter will suit you better.`,
];

/**
 * Honest, two columns, four lines each. A real exclusion list raises desire and
 * filters the application pool at the same time.
 */
export function WhoFor() {
  return (
    <section className="section">
      <div className="shell grid-12">
        <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-5">
          <hr className="rule-gold" />
          <p className="t-eyebrow">Who this is for</p>
          <ul className="flex flex-col">
            {FOR_HER.map((line) => (
              <li key={line} className="t-body border-b border-rule py-4 last:border-b-0">
                {line}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:col-start-8" delay={80}>
          <hr className="rule-gold" />
          <p className="t-eyebrow">Who it is not for</p>
          <ul className="flex flex-col">
            {NOT_FOR_HER.map((line) => (
              <li
                key={line}
                className="t-body border-b border-rule py-4 text-fg-muted last:border-b-0"
              >
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
