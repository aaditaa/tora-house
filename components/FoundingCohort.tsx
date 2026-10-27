import { Reveal } from "@/components/Reveal";
import {
  CITY,
  closeDateLabel,
  cohortSizeLabel,
  isCohortOpen,
} from "@/lib/config";

/**
 * Full-width --ink, --bone type, --brass hairlines, and the largest single number
 * on the page.
 *
 * A live count of remaining places belongs here if it is ever wanted. The boundary
 * is marked below. Do not fake one: a real number honoured beats "limited seats" by
 * a distance, and an invented countdown destroys the credibility of everything above.
 */
export function FoundingCohort() {
  const open = isCohortOpen();

  return (
    <section id="cohort" className="anchor on-dark bg-ink">
      <div className="shell section flex flex-col gap-12">
        <Reveal className="flex flex-col gap-5">
          <hr className="rule-brass" />
          <p className="t-eyebrow">The founding cohort</p>
        </Reveal>

        <Reveal delay={80}>
          {/* <RemainingPlacesCounter /> — component boundary for a live, honoured count. */}
          <p
            className="font-display leading-[0.85] tracking-[-0.03em] text-fg"
            style={{
              fontSize: "clamp(6rem, 22vw, 16rem)",
              overflowWrap: "anywhere",
            }}
          >
            {cohortSizeLabel()}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <hr className="rule" />
        </Reveal>

        <Reveal delay={240}>
          <dl className="grid-12 gap-y-8">
            <div className="col-span-12 flex flex-col gap-2 md:col-span-4">
              <dt className="t-eyebrow">City</dt>
              <dd className="t-h3 text-fg">{CITY}</dd>
            </div>
            <div className="col-span-12 flex flex-col gap-2 md:col-span-4">
              <dt className="t-eyebrow">Entry</dt>
              <dd className="t-h3 text-fg">Referral or application only</dd>
            </div>
            <div className="col-span-12 flex flex-col gap-2 md:col-span-4">
              <dt className="t-eyebrow">
                {open ? "Applications close" : "Applications closed"}
              </dt>
              <dd className="t-h3 text-fg">{closeDateLabel()}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
