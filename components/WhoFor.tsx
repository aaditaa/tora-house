import { Reveal } from "@/components/Reveal";
import { AGE_RANGE } from "@/lib/config";

const FOR_HER = [
  `You are a woman between ${AGE_RANGE.replace("–", " and ")}.`,
  "You want people around you, not an app to follow on your own.",
  "You have tried several things that ended, and you are tired of starting over.",
  "You would rather hand this to someone competent than keep running it yourself.",
];

/**
 * Four plain lines on hairlines, then one that says no.
 *
 * This sat beside a matching "Who it is not for" column until that list was
 * dropped, and the room section carried the last of the exclusions until that
 * went too. The sentence under the list is what is left of both, and it is here
 * rather than back in the room because this is the section that does the
 * filtering — four yeses and a no, in the place a reader is already asking
 * whether she qualifies. One line, not a second column: the column is what made
 * the page argue with itself.
 *
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

          <p className="t-statement pt-2">
            Performance athletes are not admitted — if you are training for an
            event, this is the wrong room.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
