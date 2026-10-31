import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { CITY } from "@/lib/config";

/**
 * One framing statement, not two. The city chapter used to sit here as well, and
 * once it became the first row of the cadence list below it was on this screen
 * twice under the same label — the thing the list exists to stop.
 */
const ITEMS = [
  {
    eyebrow: "Matched by life stage",
    title: "Your decade, not your split times",
    body: "Groups are matched by where life is, not by how fit anyone is. The same decade, the same demands, the same starting point — and nobody in the corner training for a race.",
  },
];

type RoomEvent = {
  cadence: string;
  title: string;
  body: string;
};

/**
 * A year's rhythm, read in one place and in order of frequency. With the cadence
 * in a column of its own the titles stop having to carry it: "Twice a year, away"
 * became "The retreats" once the words "twice a year" were already on the row.
 * The bodies are a sentence or two each, because six of them are on screen at
 * once now rather than one at a time.
 */
const ROOM: readonly RoomEvent[] = [
  {
    cadence: "Every two weeks",
    title: "The city chapter",
    body: `The room, in person, in ${CITY}.`,
  },
  {
    cadence: "2 times a month",
    title: "The reading table",
    body: "One book, read by everyone, argued over a long table. The people who turn up are the ones who read it, which is most of the point.",
  },
  {
    cadence: "2 times a month",
    title: "Coffee with the guides",
    body: "Coffee with the women doing this alongside you, and with the guides who wrote the plans. Off the clock, and nobody has a next appointment waiting.",
  },
  {
    cadence: "2 times a month",
    title: "Jive, jazz and listening evenings",
    body: "Dancing, live music, and evenings where the only thing happening is a record and the people around it. The room meets somewhere that is not a studio.",
  },
  {
    cadence: "A few evenings a year",
    title: "Partners' evenings",
    body: "The room opens to partners. Same house, same table, no programme to get through. The people you train beside, met properly by the person you go home to.",
  },
  {
    cadence: "Twice a year",
    title: "The retreats",
    body: "Two retreats across the year, taken alone or with the room. Rooms, travel and the practice running through the days are arranged before you decide anything.",
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
 * The retreats block that used to sit in this column is now the last row of the
 * cadence list. Keeping both would have said the same thing twice within one
 * screen.
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

        {/* The cadence in its own column, so the eye can run down the left
            edge and read the year as frequency before reading it as content. */}
        <div className="flex flex-col gap-8">
          <Reveal>
            <h3 className="t-h3 text-fg">What a year in the room holds.</h3>
          </Reveal>

          <ul className="flex flex-col">
            {ROOM.map((event, i) => (
              <Reveal
                as="li"
                key={event.title}
                className="grid-12 border-b border-rule py-6"
                delay={i * 80}
              >
                <p className="t-h4 col-span-12 text-accent-type md:col-span-3">
                  {event.cadence}
                </p>
                <div className="col-span-12 flex flex-col gap-2 md:col-span-8 md:col-start-5">
                  <h4 className="t-h4 text-fg">{event.title}</h4>
                  <p className="t-body text-fg-muted">{event.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
