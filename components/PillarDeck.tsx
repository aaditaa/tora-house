"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PillarCard = {
  title: string;
  body: string;
};

type PillarDeckProps = {
  /** Names the deck for a screen reader: the pillar it belongs to. */
  label: string;
  cards: readonly PillarCard[];
};

/**
 * The one new structural device on the page: a horizontal deck on native scroll
 * snap, used by all four pillars.
 *
 * It scrolls natively rather than translating a track, so the phone keeps its own
 * momentum and rubber-banding and the keyboard keeps its own focus handling. The
 * arrows and the count read the scroller; they never drive it except on a click.
 *
 * The deck breaks its right edge out of the shell and keeps its left edge on the
 * text column above it. That half-visible next card is the only affordance there
 * is — no dots, no autoplay, nothing that moves on its own — so boxing the deck in
 * on both sides would leave a phone with no way to know it scrolls at all.
 */
export function PillarDeck({ label, cards }: PillarDeckProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** One card plus one gap, measured rather than assumed, so it survives a resize. */
  const step = useCallback(() => {
    const el = scroller.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return 0;
    const second = first.nextElementSibling as HTMLElement | null;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  }, []);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const start = el.scrollLeft <= 1;
    const end = el.scrollLeft >= max - 1;
    const width = step();
    setAtStart(start);
    setAtEnd(end);
    // At the far end the last card is flush right rather than snapped left, so the
    // rounded position lands short of it. The count should still say the last card.
    setIndex(
      end
        ? cards.length - 1
        : width
          ? Math.min(
              cards.length - 1,
              Math.max(0, Math.round(el.scrollLeft / width)),
            )
          : 0,
    );
  }, [cards.length, step]);

  useEffect(() => {
    sync();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const move = useCallback(
    (direction: -1 | 1) => {
      const el = scroller.current;
      const width = step();
      if (!el || !width) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      el.scrollBy({
        left: direction * width,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [step],
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={scroller}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className="deck-scroller"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {cards.map((card, i) => (
          <article
            key={card.title}
            role="group"
            aria-label={`${i + 1} of ${cards.length}`}
            className="deck-card"
          >
            <h4 className="t-h4">{card.title}</h4>
            <p className="t-body">{card.body}</p>
          </article>
        ))}
      </div>

      {/* The track and the count say the same thing twice, once for a glance and
          once for anyone who needs the number. Neither is a control. */}
      <div className="flex items-center gap-5">
        <div className="deck-track flex-1" aria-hidden="true">
          <div
            className="deck-track-fill"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>

        <p
          className="t-meta shrink-0 tabular-nums text-fg-muted"
          aria-hidden="true"
        >
          {index + 1} / {cards.length}
        </p>

        <div className="deck-nav shrink-0 gap-2">
          <button
            type="button"
            className="deck-button"
            onClick={() => move(-1)}
            disabled={atStart}
            aria-label={`Previous card in ${label}`}
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            className="deck-button"
            onClick={() => move(1)}
            disabled={atEnd}
            aria-label={`Next card in ${label}`}
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path
        d={direction === "left" ? "M10 2 4 8l6 6" : "M6 2l6 6-6 6"}
        strokeLinecap="square"
      />
    </svg>
  );
}
