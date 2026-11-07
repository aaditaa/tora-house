"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Portrait, Screen } from "@/components/demo/Bits";
import { guide, guideCall, guideTopics } from "@/lib/demo-data";

/**
 * Not a form. The 26 questions are asked by a guide on a call, so this screen
 * shows the ground that conversation covers and nothing is typed in.
 */
export default function SurveyPage() {
  const deck = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState(0);

  // Which card is under the snap point. Measured from the cards themselves: the
  // deck's padding means a card is narrower than the scroll viewport, so any sum
  // of widths and gaps drifts by the fourth card.
  const onScroll = useCallback(() => {
    const el = deck.current;
    if (!el) return;
    let best = 0;
    let least = Infinity;
    for (let i = 0; i < el.children.length; i += 1) {
      const child = el.children[i] as HTMLElement;
      const gap = Math.abs(child.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (gap < least) {
        least = gap;
        best = i;
      }
    }
    setCard(best);
  }, []);

  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  function goTo(i: number) {
    const el = deck.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  return (
    <Screen
      eyebrow="On your call"
      title="What Ananya will ask."
      lede={`${guide.name} takes these with you on your call, with your panel already in front of you both.`}
      footer={
        <Link href="/demo/journey" className="btn btn-primary w-full">
          Continue
        </Link>
      }
    >
      <div className="flex items-center gap-3 border-y border-rule py-3.5">
        <Portrait initials={guide.initials} size={40} label={guide.name} />
        <div className="flex flex-col gap-0.5">
          <p className="t-meta font-medium">{guide.name}</p>
          <p className="t-eyebrow">
            {guideCall.length} · {guideCall.questionCount} questions
          </p>
        </div>
      </div>

      {/* The deck. Swipe, or use the dots. */}
      <div className="flex flex-col gap-4">
        <div
          ref={deck}
          className="demo-deck"
          tabIndex={0}
          role="group"
          aria-label="The areas your guide covers"
        >
          {guideTopics.map((topic, i) => (
            <article
              key={topic.id}
              className="demo-card demo-rise"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${guideTopics.length}: ${topic.section}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p
                  className="t-eyebrow"
                  style={{ color: "var(--accent-type)" }}
                >
                  {topic.section}
                </p>
                <span className="t-numeral text-[0.8125rem] text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="t-body">{topic.covers}</p>

              <ul className="mt-auto flex flex-col gap-2.5 border-t border-rule pt-3.5">
                {topic.examples.map((q) => (
                  <li key={q} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] h-px w-3 flex-none bg-brass"
                    />
                    <span className="t-meta text-fg-muted">{q}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex flex-1 gap-1.5"
            role="tablist"
            aria-label="Areas"
          >
            {guideTopics.map((topic, i) => (
              <button
                key={topic.id}
                type="button"
                role="tab"
                aria-selected={i === card}
                aria-label={topic.section}
                onClick={() => goTo(i)}
                className="flex-1 py-2.5"
              >
                <span
                  className={`block h-px w-full transition-colors duration-300 ${
                    i === card ? "bg-brass" : "bg-rule"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="t-eyebrow whitespace-nowrap">
            {card + 1} / {guideTopics.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-rule pt-4">
        <p className="t-meta text-fg-muted">{guideCall.who}</p>
        <p className="t-meta text-fg-muted">{guideCall.after}</p>
      </div>
    </Screen>
  );
}
