import Link from "next/link";

import { Reveal } from "@/components/Reveal";

type Entry = { q: string; a: React.ReactNode };

const ENTRIES: Entry[] = [
  {
    q: "What does the first month look like?",
    a: (
      <>
        The panel, the movement and mobility screen, and a mapping of how your
        week actually runs. Then an hour going through all of it with your
        guide, and the first six-to-eight week plan written out of what it
        showed. Somewhere in there you come to your first chapter evening,
        before you have done anything to prove yourself.
      </>
    ),
  },
  {
    q: "Does this work if I travel a lot?",
    a: (
      <>
        Yes, and the plan is written around the travel rather than in spite of
        it. Sessions can run remotely, and the fortnightly chapter is
        fortnightly precisely because missing one is normal. The thing that does
        not work is never being in the room at all — which is why the
        application asks about it plainly.
      </>
    ),
  },
  {
    q: "Do I need to be fit to start?",
    a: (
      <>
        No. Most members start from nothing, or from several years of starting
        and stopping. The screen exists so the plan can begin where your body
        actually is rather than where a class assumes it is.
      </>
    ),
  },
  {
    q: "What is the real time commitment?",
    a: (
      <>
        Practice sits at about {"{{TBD}}"} across a week, plus one evening a
        fortnight with your chapter and one review a quarter. The weekly shape
        is written around the week you have, not an ideal one.
      </>
    ),
  },
  {
    q: "What happens to what I write on the form?",
    a: (
      <>
        It is stored in a managed Postgres database, read by the small team
        assessing applications, and used for that and for a research
        conversation only if you tick the box asking for one. It is not sold or
        shared. The{" "}
        <Link href="/privacy" className="link">
          privacy note
        </Link>{" "}
        says what is kept, for how long, and how to have it deleted.
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: (
      <>
        {"{{TBD}}"}. The figure is discussed on the call after your application
        rather than posted here, because what a year holds differs between
        members and we would rather quote you honestly than publish a number
        that is wrong for half the women reading it.
      </>
    ),
  },
];

/**
 * Plain accordion: native details/summary, hairline dividers, no chrome. Works
 * without JavaScript and is keyboard-operable by default.
 */
export function Faq() {
  return (
    <section id="faq" className="anchor section">
      <div className="shell grid-12">
        <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-4">
          <hr className="rule-brass" />
          <p className="t-eyebrow">Questions</p>
          <h2 className="t-h2">Before you ask.</h2>
          <p className="t-body text-fg-muted">
            Anything not answered here is worth putting in the last box of the
            application.
          </p>
        </Reveal>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <Reveal>
            <ul className="flex flex-col border-t border-rule">
              {ENTRIES.map((entry) => (
                <li key={entry.q} className="border-b border-rule">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <span className="t-h3">{entry.q}</span>
                      <span
                        aria-hidden="true"
                        className="relative mt-2 h-3 w-3 flex-none text-fg-muted"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current group-open:hidden" />
                      </span>
                    </summary>
                    <p className="t-body pr-10 pb-7 text-fg-muted">{entry.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
