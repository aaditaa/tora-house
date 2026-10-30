import { Figure } from "@/components/Figure";
import { PillarDeck, type PillarCard } from "@/components/PillarDeck";
import { Reveal } from "@/components/Reveal";

const VETTED: readonly PillarCard[] = [
  {
    title: "Pilates, spin, HYROX",
    body: "Reformer, studio cycling and the hybrid race format, run as immersions when the strength work calls for them. Taken because your plan asks for them, not because they are the thing this year.",
  },
  {
    title: "Clubs and courts",
    body: "Tennis, squash, swimming, and the clubs that hold them. Access is arranged and booked for you, so a court at seven in the morning is a message rather than a membership negotiation.",
  },
  {
    title: "Sound, music and Reiki",
    body: "Sound baths, listening work and Reiki, with practitioners contracted and checked before you meet them. Sat with properly, once, so you can tell whether it belongs in your week.",
  },
  {
    title: "Japanese contemplative practice",
    body: "Tea, calligraphy and seated attention, taught by people who were taught. Slow by design. The point is the hour you spend not solving anything, which is harder than it sounds.",
  },
  {
    title: "Nutrition protocols worth importing",
    body: "What survives the filter from abroad, adapted to your food and your kitchen. Not a plan built on ingredients you would have to order in, and not one you are left to follow alone.",
  },
  {
    title: "Teachers flown in",
    body: "Teachers worth sitting with are brought here for limited-seat sessions, rather than becoming another trip you have to plan around a quarter you have already filled.",
  },
  {
    title: "Sit with it once, properly taught",
    body: "Cold exposure, a new breath practice, whatever is being talked about this year. You sit with it once, taught properly, before deciding whether it belongs in your plan.",
  },
];

/**
 * Pillar III. The filter argument and the vetting standard were two blocks at the
 * end of the method; together they are one pillar, because "what we let in" and
 * "what we hold it to" are the same claim said twice. The checked roster moved
 * here from the old concierge section for the same reason.
 */
export function Vetted() {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-14">
        <div className="grid-12 items-start">
          <div className="col-span-12 flex flex-col gap-10 lg:col-span-6">
            <Reveal className="flex flex-col gap-6">
              <hr className="rule-brass" />
              <p className="t-eyebrow">What survives</p>
              <h2 className="t-h2">
                The best of global longevity practice,{" "}
                <span className="em-serif">filtered</span>.
              </h2>
              <p className="t-body">
                What is worth taking is taken, and then adapted for your food,
                your climate, your family structure and your calendar.
              </p>
              <p className="t-statement">
                The value is in what is left out. Most of what is marketed to
                you from abroad does not survive the filter.
              </p>
            </Reveal>

            <Reveal className="flex flex-col gap-5" delay={80}>
              <hr className="rule-brass" />
              <p className="t-eyebrow">The standard</p>
              <h3 className="t-h3">Everything vetted.</h3>
              <p className="t-body">
                Every practitioner you are sent to is certified, contracted and
                checked before you meet them, so that a referral carries the
                same weight as the plan it came from. Physiotherapy, nutrition,
                Ayurvedic consultation and allied practitioners are on a roster
                that was checked before it reached you. You are not auditioning
                anyone.
              </p>
            </Reveal>
          </div>

          <Reveal
            className="col-span-12 lg:col-span-5 lg:col-start-8"
            delay={160}
          >
            <Figure slug="practice" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          <PillarDeck label="Vetted global longevity practice" cards={VETTED} />
          <p className="t-meta max-w-[62ch] text-fg-muted">
            These run as immersions, online or in person, with certified
            practitioners.
          </p>
        </div>
      </div>
    </section>
  );
}
