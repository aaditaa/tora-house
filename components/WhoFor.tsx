import { Reveal } from "@/components/Reveal";
import { AGE_RANGE } from "@/lib/config";

const FOR_HER = [
  `You are a woman between ${AGE_RANGE.replace("–", " and ")}.`,
  "You want people around you, not an app to follow on your own.",
  "You have tried several things that ended, and you are tired of starting over.",
  "You would rather hand this to someone competent than keep running it yourself.",
];

/**
 * Four plain lines on hairlines. This sat beside a matching "Who it is not for"
 * column until that list was dropped, and the room section carried the last of
 * the exclusions until that went too. Nothing on the page now says who it is
 * not for — these four lines are the whole of the filter, and they only say yes.
 * The list keeps a six-column measure so it reads as a column of prose rather
 * than stretching to a full-width table of one-liners.
 */
export function WhoFor() {
  return (
    <section className="section">
      <div className="shell grid-12">
        <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <hr className="rule-brass" />
          <p className="t-eyebrow">Who this is for</p>
          <ul className="flex flex-col">
            {FOR_HER.map((line) => (
              <li
                key={line}
                className="t-body border-b border-rule py-4 last:border-b-0"
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
