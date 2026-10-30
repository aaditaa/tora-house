import { Figure } from "@/components/Figure";
import { PillarDeck, type PillarCard } from "@/components/PillarDeck";
import { Reveal } from "@/components/Reveal";

const CONCIERGE: readonly PillarCard[] = [
  {
    title: "Your guide, for the year",
    body: "One lead guide, named, for twelve months. Not a rotating roster, and not whoever is free on Tuesday. She reads your panel, she writes your plan, and she is the person you ask.",
  },
  {
    title: "One plan, not five opinions",
    body: "Five disciplines, one document. Nobody contradicts anybody because nobody is working alone — the strength work and the Ayurvedic rhythm are written by the same person, in the same week.",
  },
  {
    title: "Rewritten when the markers move",
    body: "The panel is read again through the year. When something in it shifts, the plan is rewritten that week — not held until the quarter ends, and not left for you to notice first.",
  },
  {
    title: "Your history, held in one place",
    body: "Your knees, your travel, your mother's surgery, the three years before this. Said once. It is already known the next time you walk in, and the plan moves without you briefing anyone.",
  },
  {
    title: "The private line",
    body: "Panel renewals, retreat logistics and practitioner bookings, with the chasing that follows them. You are told where to be and when. The rest happens somewhere you do not have to watch it.",
  },
];

/**
 * Pillar II. The old "Everything else" section is gone: coordination was never a
 * leftover, it is what the concierge does, so it sits here on a card instead of in
 * a bin at the end of the page. The vetted roster moved the other way, into
 * Pillar III, where the argument about standards already lives.
 */
export function Concierge() {
  return (
    <section className="on-sand section bg-surface">
      <div className="shell flex flex-col gap-14">
        <div className="grid-12 items-center">
          <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-7">
            <hr className="rule-brass" />
            <p className="t-eyebrow">One guide</p>
            <h2 className="t-h2">
              A named guide who knows your{" "}
              <span className="em-serif">history</span>.
            </h2>
            <p className="t-body">
              One lead guide for the year, not a rotating roster. You explain
              your knees once. Your travel, your mother&apos;s surgery, the
              three years before this — all of it is already known the next time
              you walk in, and the plan moves without you having to brief
              anyone. That is the line between a membership and a marketplace,
              and it is the whole of it.
            </p>
          </Reveal>

          <Reveal
            className="col-span-12 lg:col-span-4 lg:col-start-9"
            delay={80}
          >
            <Figure slug="sound" sizes="(min-width: 1024px) 28vw, 100vw" />
          </Reveal>
        </div>

        <PillarDeck
          label="Your concierge, and one coach across every discipline"
          cards={CONCIERGE}
        />
      </div>
    </section>
  );
}
