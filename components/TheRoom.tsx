import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { CITY } from "@/lib/config";

/**
 * The warmest section on the page. Full-bleed 3:2 image with the text overlaid in a
 * lower-left well on a soft --umber scrim — the only gradient on the site.
 */
export function TheRoom() {
  return (
    <section id="room" className="anchor">
      <div className="relative">
        <Figure
          slug="room"
          sizes="100vw"
          overlaid
          className="min-h-[34rem] w-full lg:min-h-[44rem]"
        />

        <div className="scrim on-dark absolute inset-0 flex items-end" aria-hidden="false">
          <div className="shell w-full pt-32 pb-14 lg:pb-20">
            <Reveal className="max-w-[46rem]">
              <hr className="rule-gold" />
              <p className="t-eyebrow pt-5">The room</p>
              <h2 className="t-h2 pt-4 text-fg">
                People do not quit rooms where they are <span className="em-serif">known</span>.
              </h2>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="bg-umber on-dark">
        <div className="shell section grid-12">
          <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-4">
            <hr className="rule" />
            <p className="t-eyebrow pt-1">Every two weeks</p>
            <h3 className="t-h3 text-fg">The city chapter</h3>
            <p className="t-body text-fg-muted">
              The {CITY} chapter meets in person every two weeks. It is the part of this you cannot
              buy anywhere else, and the part that keeps the rest of it going.
            </p>
          </Reveal>

          <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-4" delay={80}>
            <hr className="rule" />
            <p className="t-eyebrow pt-1">Matched by life stage</p>
            <h3 className="t-h3 text-fg">Your decade, not your split times</h3>
            <p className="t-body text-fg-muted">
              Groups are matched by where life is, not by how fit anyone is. The same decade, the
              same demands, the same starting point — and nobody in the corner training for a race.
            </p>
          </Reveal>

          <Reveal className="col-span-12 flex flex-col gap-5 lg:col-span-4" delay={160}>
            <hr className="rule" />
            <p className="t-eyebrow pt-1">A few times a year</p>
            <h3 className="t-h3 text-fg">Retreats, capped</h3>
            <p className="t-body text-fg-muted">
              Members-only, small, and run by the people you already train with. A normal retreat is
              a week with people you will never see again. This one is a week with your room.
            </p>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-7" delay={80}>
            <Figure slug="retreat" sizes="(min-width: 1024px) 58vw, 100vw" />
          </Reveal>

          <Reveal className="col-span-12 flex flex-col justify-center gap-5 lg:col-span-5" delay={160}>
            <hr className="rule-gold" />
            <p className="t-eyebrow pt-1">Who is not here</p>
            <p className="t-statement text-fg">
              Performance athletes are not admitted.
            </p>
            <p className="t-body text-fg-muted">
              If you are training for an event, this is the wrong room. Saying so plainly is the
              only way to make it the right one for everybody else in it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
