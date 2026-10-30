import { Figure } from "@/components/Figure";
import { PillarDeck, type PillarCard } from "@/components/PillarDeck";
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
];

const ROOM: readonly PillarCard[] = [
  {
    title: "The reading table",
    body: "One book, read by everyone, argued over a long table. No summaries and no slides. The people who turn up are the ones who read it, which is most of the point.",
  },
  {
    title: "Coffee with the people who wrote your plan",
    body: "Coffee with the women doing this alongside you, and with the guides who wrote the plans. Off the clock. You ask what does not fit inside a session, and nobody has a next appointment waiting.",
  },
  {
    title: "Jive, jazz and listening evenings",
    body: "Dancing, live music, and evenings where the only thing happening is a record and the people around it. Nothing to achieve. The room meets somewhere that is not a studio.",
  },
  {
    title: "Partners' evenings",
    body: "A few evenings a year the room opens to partners. Same house, same table, no programme to get through. The people you train beside, met properly by the person you go home to.",
  },
  {
    title: "Twice a year, away",
    body: "Two retreats planned across the year, taken alone or with the room. Rooms, travel and the practice running through the days are arranged before you are asked to decide anything.",
  },
];

/**
 * Pillar IV. The warmest section on the page. The photograph sits upright in the
 * grid at its own shape rather than being stretched across a full-bleed band — a
 * wide band can only ever show a slice of an upright frame, which is what made
 * this read as a heavy crop.
 *
 * The heading sits above the photograph in the left column rather than over the
 * cards. With the image alone on the left, its column ran out well before the
 * prose beside it did, leaving a tall empty block under it.
 *
 * The retreats block that used to sit in this column is now the last card in the
 * deck. Keeping both would have said the same thing twice within one screen.
 */
export function TheRoom() {
  return (
    <section id="room" className="anchor on-dark bg-vetiver">
      <div className="shell section flex flex-col gap-16">
        <div className="grid-12">
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

          <div className="col-span-12 flex flex-col justify-between gap-12 lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7">
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

            <Reveal delay={80}>
              <Figure slug="chapter" sizes="(min-width: 1024px) 45vw, 100vw" />
            </Reveal>
          </div>
        </div>

        <PillarDeck label="The Room" cards={ROOM} />
      </div>
    </section>
  );
}
