import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { CITY } from "@/lib/config";

const ITEMS = [
  {
    eyebrow: "Every two weeks",
    title: "The city chapter",
    body: `The ${CITY} chapter meets in person every two weeks. It is the part of this you cannot buy anywhere else, and the part that keeps the rest of it going.`,
  },
  {
    eyebrow: "Matched by life stage",
    title: "Your decade, not your split times",
    body: "Groups are matched by where life is, not by how fit anyone is. The same decade, the same demands, the same starting point — and nobody in the corner training for a race.",
  },
  {
    eyebrow: "A few times a year",
    title: "Retreats, capped",
    body: "Members-only, small, and run by the people you already train with. A normal retreat is a week with people you will never see again. This one is a week with your room.",
  },
];

/**
 * The warmest section on the page. The photograph sits upright in the grid at its
 * own shape rather than being stretched across a full-bleed band — a wide band can
 * only ever show a slice of an upright frame, which is what made this read as a
 * heavy crop.
 *
 * The heading sits above the photograph in the left column rather than over the
 * cards. With the image alone on the left, its column ran out well before the three
 * cards and the closing statement did, leaving a tall empty block under it; moving
 * the heading across fills that and brings the two columns to within a card's
 * height of each other. Full-bleeding the image would have closed the gap too, but
 * only by reintroducing the crop this section was already rebuilt to avoid.
 *
 * Between 1024 and 1280 the cards take the seventh column as well, closing up the
 * gutter column the wider layout keeps. The photograph shrinks with the grid while
 * the prose beside it grows taller as it narrows, so at that width the two columns
 * drift apart again — 256px of nothing under the frame — and the extra column of
 * measure is what brings them back together.
 */
export function TheRoom() {
  return (
    <section id="room" className="anchor on-dark bg-vetiver">
      <div className="shell section grid-12 items-start">
        <div className="col-span-12 flex flex-col gap-12 lg:col-span-5">
          <Reveal className="flex flex-col gap-5">
            <hr className="rule-brass" />
            <p className="t-eyebrow">The room</p>
            <h2 className="t-h2 text-fg">
              People do not quit rooms where they are{" "}
              <span className="em-serif">known</span>.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <Figure slug="room" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>

        <div className="col-span-12 flex flex-col gap-12 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
          <div className="flex flex-col">
            {ITEMS.map((item, i) => (
              <Reveal
                key={item.title}
                className="flex flex-col gap-4 py-8"
                delay={i * 80}
              >
                <hr className="rule" />
                <p className="t-eyebrow pt-2">{item.eyebrow}</p>
                <h3 className="t-h3 text-fg">{item.title}</h3>
                <p className="t-body text-fg-muted">{item.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="flex flex-col gap-5" delay={80}>
            <hr className="rule-brass" />
            <p className="t-eyebrow pt-1">Who is not here</p>
            <p className="t-statement text-fg">
              Performance athletes are not admitted.
            </p>
            <p className="t-body text-fg-muted">
              If you are training for an event, this is the wrong room. Saying
              so plainly is the only way to make it the right one for everybody
              else in it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
