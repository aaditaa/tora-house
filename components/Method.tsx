import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";

/**
 * Four pillars, each a substantial block rather than a card, with a fine --brass rule
 * above each eyebrow. The first two share a well beside the photograph; the last two
 * take the full width. Every block starts on the page's left edge.
 */
export function Method() {
  return (
    <section id="method" className="anchor section">
      <div className="shell flex flex-col gap-20 lg:gap-28">
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

        {/* 1 and 2 — stacked in one well beside the frame. Apart, the second
            pillar sat alone against an empty half-page. */}
        <div className="grid-12 items-start">
          <div className="col-span-12 flex flex-col gap-14 lg:col-span-6">
            <Reveal className="flex flex-col gap-5">
              <hr className="rule-brass" />
              <p className="t-eyebrow">One curriculum</p>
              <h3 className="t-h3">One curriculum, not six subscriptions.</h3>
              <p className="t-body">
                Strength and mobility, yoga, breathwork, sadhana and Ayurvedic
                daily rhythm, sequenced into a single plan and revisited every
                six to eight weeks. One person holds all five and decides which
                of them you need this season. What ends is the assembling: the
                separate trainers, the separate apps, the separate bills, the
                quiet job of keeping them all pointed in the same direction.
              </p>
            </Reveal>

            <Reveal className="flex flex-col gap-5" delay={80}>
              <hr className="rule-brass" />
              <p className="t-eyebrow">One guide</p>
              <h3 className="t-h3">A named guide who knows your history.</h3>
              <p className="t-body">
                One lead guide for the year, not a rotating roster. You explain
                your knees once. Your travel, your mother&apos;s surgery, the
                three years before this — all of it is already known the next
                time you walk in, and the plan moves without you having to brief
                anyone. That is the line between a membership and a marketplace,
                and it is the whole of it.
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

        {/* 3 — the strongest line on the page. Given room, text only. It used
            to start at column four, which put its left edge nowhere near any
            other block on the page; it now begins on the same edge as the
            rest and keeps the eight-column measure. */}
        <div className="grid-12">
          <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-8">
            <hr className="rule-brass" />
            <p className="t-eyebrow">What survives</p>
            <h3 className="t-h3">
              The best of global longevity practice,{" "}
              <span className="em-serif">filtered</span>.
            </h3>
            <p className="t-body">
              What is worth taking is taken, and then adapted for your food,
              your climate, your family structure and your calendar.
            </p>
            <p className="t-statement">
              The value is in what is left out. Most of what is marketed to you
              from abroad does not survive the filter.
            </p>
          </Reveal>
        </div>

        {/* 4 — text left */}
        <div className="grid-12">
          <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-6">
            <hr className="rule-brass" />
            <p className="t-eyebrow">The standard</p>
            <h3 className="t-h3">Everything vetted.</h3>
            <p className="t-body">
              Every practitioner you are sent to is certified, contracted and
              checked before you meet them, so that a referral carries the same
              weight as the plan it came from. The standard they are held to,
              stated in full: {"{{TBD}}"}.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
