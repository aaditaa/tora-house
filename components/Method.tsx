import { Figure } from "@/components/Figure";
import { PillarDeck, type PillarCard } from "@/components/PillarDeck";
import { Reveal } from "@/components/Reveal";

const TRADITIONS: readonly PillarCard[] = [
  {
    title: "Strength and mobility",
    body: "Loaded work two or three times a week, scaled to what your screen showed rather than to a class average. The weight goes up when the movement holds, not when the calendar says so.",
  },
  {
    title: "Yoga",
    body: "Asana and pranayama taught as practice rather than as a class you attend. The sequence changes with the season, and with what your sleep and stress have been doing since the last panel.",
  },
  {
    title: "Breathwork and meditation",
    body: "Paced breath and seated practice, prescribed in short daily doses rather than as a retreat you attend once a year. Your guide sets the dose against what this quarter is doing to your sleep.",
  },
  {
    title: "Ayurvedic daily rhythm",
    body: "When you eat, when you sleep, what changes in October. Dinacharya written for your house and your working week, not for an ashram timetable you were never going to keep.",
  },
  {
    title: "Pain management and recovery",
    body: "The knee, the shoulder, the back that has been there for years. Assessed, then worked on inside the plan rather than referred out and left for you to chase between appointments.",
  },
];

/**
 * Pillar I, and the lead-in to all four.
 *
 * The baseline statement sits here rather than in its own section because it is
 * the join: it says why the four pillars are one membership, and the hairline
 * under it is what makes the first pillar read as the start of a run rather than
 * as another block. Its label is set in --t-meta, the site's sentence-case small
 * type, rather than in the letterspaced caps the rest of the page uses for
 * eyebrows — the brief asks for sentence case here, and t-meta is the existing
 * style that already is.
 */
export function Method() {
  return (
    <section id="method" className="anchor section">
      <div className="shell flex flex-col gap-20 lg:gap-28">
        <div className="flex flex-col gap-10">
          <Reveal className="grid-12 items-start gap-y-6">
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <p className="t-meta text-fg-muted">One baseline</p>
              <h2 className="t-h2">
                Everything runs on{" "}
                <span className="em-serif">one baseline</span>.
              </h2>
            </div>
            <p className="t-body col-span-12 lg:col-span-5 lg:col-start-8">
              Your own biomarkers, read against Indian reference points rather
              than imported ones. Every plan is written from that reading, and
              measured back against it.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <hr className="rule" />
          </Reveal>
        </div>

        {/* The frame says who this is for before the pillars argue it, so it
            sits with the opening rather than on its own.

            This is the only one of the three photograph blocks with the image
            on the left. Three identical arrangements in a column read as a
            template; one mirror in the middle breaks that without disturbing
            the rhythm, so the frame keeps the five columns, the gutter and the
            items-start alignment the other two use. The mirror is done with
            explicit column and row placement rather than by reordering the
            markup, so the stacking order below lg stays text-then-image like
            its neighbours — and so the heading still precedes its illustration
            for anyone reading in source order. */}
        <div className="grid-12 items-start">
          <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <hr className="rule-brass" />
            <p className="t-eyebrow">The method</p>
            <h2 className="t-h2">
              Five traditions, one <span className="em-serif">sequence</span>.
            </h2>
            <p className="t-lede">
              Not six things you are left to coordinate. One plan, written by
              one person, revisited as the year moves.
            </p>
          </Reveal>

          <Reveal
            className="col-span-12 lg:col-span-5 lg:col-start-1 lg:row-start-1"
            delay={80}
          >
            <Figure
              slug="generations"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </Reveal>
        </div>

        <div className="flex flex-col gap-12">
          <div className="grid-12 items-center">
            <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-7">
              <hr className="rule-brass" />
              <p className="t-eyebrow">One curriculum</p>
              <h3 className="t-h3">One curriculum, not six subscriptions.</h3>
              <p className="t-body">
                Strength and mobility, yoga, breathwork and meditation,
                Ayurvedic daily rhythm, and pain management and recovery,
                sequenced into a single plan and revisited every six to eight
                weeks. One person holds all five and decides which of them you
                need this season. What ends is the assembling: the separate
                trainers, the separate apps, the separate bills, the quiet job
                of keeping them all pointed in the same direction.
              </p>
            </Reveal>

            <Reveal
              className="col-span-12 lg:col-span-4 lg:col-start-9"
              delay={80}
            >
              <Figure slug="strength" sizes="(min-width: 1024px) 28vw, 100vw" />
            </Reveal>
          </div>

          <PillarDeck
            label="Five traditions, one curriculum"
            cards={TRADITIONS}
          />
        </div>
      </div>
    </section>
  );
}
