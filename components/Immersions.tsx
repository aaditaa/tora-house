import { Fragment } from "react";

import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { CITY } from "@/lib/config";

type Immersion = {
  title: string;
  body: string;
};

/**
 * Seven cards became four groups. The seven were a list of things, and a list of
 * things invites a reader to look for the one she wants rather than to understand
 * what any of them are; four groups make the shape of the offer readable in one
 * pass, which is the job this section was failing at.
 */
const IMMERSIONS: readonly Immersion[] = [
  {
    title: "Movement",
    body: "Reformer Pilates, studio cycling and HYROX, run when the strength work calls for them. Tennis, squash and swimming arranged and booked, so a seven o'clock court is a message rather than a negotiation.",
  },
  {
    title: "Stillness",
    body: "Sound baths, listening work and Reiki. Japanese tea, calligraphy and seated attention, taught by people who were taught. Slow by design.",
  },
  {
    title: "Visiting teachers",
    body: "Teachers worth sitting with are brought here for limited-seat sessions, rather than becoming another trip you plan around a quarter you have already filled.",
  },
  {
    title: "Protocols",
    body: "Nutrition and new practices that survive the filter from abroad, adapted to your food and your kitchen. Cold exposure, a breath method, whatever is being talked about — sat with once before it enters the plan.",
  },
];

/** The four facts a reader needs before the word means anything. */
const DEFINITION: readonly { term: string; detail: string }[] = [
  { term: "Format", detail: "Single session or short series" },
  { term: "Where", detail: `${CITY}, or online` },
  { term: "Chosen by", detail: "Your guide, from your plan" },
  { term: "Cost", detail: "Paid on top of membership" },
];

/**
 * Pillar III. The word "immersion" used to appear once, in a caption under the
 * carousel, so a reader met the thing without ever being told what it was, how
 * often it ran or that it cost extra. The definition block now sits above the
 * groups rather than below them, and the cost is in it rather than in a line
 * someone was expected to notice on the way past.
 */
export function Immersions() {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-14">
        <div className="grid-12 items-start">
          <div className="col-span-12 flex flex-col gap-10 lg:col-span-6">
            <Reveal className="flex flex-col gap-6">
              <hr className="rule-brass" />
              <p className="t-eyebrow">Immersions</p>
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
              <h3 className="t-h3">Sat with once, properly taught.</h3>
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

        {/* The sand panel is the definition, and it comes before the groups
            because a reader cannot judge the groups without it. */}
        <Reveal className="on-sand grid-12 gap-y-8 bg-sand p-10">
          <p className="t-lede col-span-12 lg:col-span-6">
            An immersion is a single session or a short series, taught by a
            vetted practitioner, run online or in {CITY}. Your guide decides
            which ones your plan calls for, and the booking is made for you.
          </p>

          <dl className="col-span-12 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 lg:col-span-5 lg:col-start-8">
            {DEFINITION.map((row) => (
              <Fragment key={row.term}>
                <dt className="t-eyebrow pt-1">{row.term}</dt>
                <dd className="t-body">{row.detail}</dd>
              </Fragment>
            ))}
          </dl>
        </Reveal>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {IMMERSIONS.map((immersion, i) => (
              <Reveal
                key={immersion.title}
                className="flex flex-col gap-3.5 border-t border-rule pt-5"
                delay={i * 80}
              >
                <h3 className="t-h3">{immersion.title}</h3>
                <p className="t-body">{immersion.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="flex flex-col gap-6" delay={320}>
            <hr className="rule" />
            <p className="t-statement">
              The first immersion runs in {CITY} in November 2026.
            </p>
            <div>
              <a href="#apply" className="btn btn-primary">
                Start the questionnaire
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
