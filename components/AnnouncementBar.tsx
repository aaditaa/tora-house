"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { barKey } from "@/lib/dismiss";

type Mode = "static" | "marquee" | "short";

// useLayoutEffect warns on the server; this is the usual guard.
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A thin strip above the cover. It scrolls away with the page; it is never
 * sticky, because the nav already is.
 *
 * It moves only when it has to. If the line fits it sits still and centred, and
 * the marquee engages only when the line would otherwise overflow — text that
 * scrolls when it had room to sit still reads as a sale. Under reduced motion it
 * never moves: a line that would overflow is swapped for a shorter one instead.
 */
export function AnnouncementBar({
  slug,
  href,
  line,
  shortLine,
  label,
  startsAt,
}: {
  slug: string;
  href: string;
  line: string;
  shortLine: string;
  label: string;
  startsAt: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [mode, setMode] = useState<Mode>("static");
  const box = useRef<HTMLAnchorElement>(null);
  const probe = useRef<HTMLSpanElement>(null);

  // A page cached for an hour can outlive the start of the event by an hour.
  // The client checks again, so the bar is gone the moment the session begins.
  useEffect(() => {
    if (new Date(startsAt).getTime() <= Date.now()) setHidden(true);
    try {
      if (window.localStorage.getItem(barKey(slug))) setHidden(true);
    } catch {
      /* No storage: the bar stays, which is the safe default. */
    }
  }, [startsAt, slug]);

  const measure = useCallback(() => {
    const el = box.current;
    const text = probe.current;
    if (!el || !text) return;
    const fits = text.scrollWidth <= el.clientWidth;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(fits ? "static" : calm ? "short" : "marquee");
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, [measure]);

  function dismiss() {
    try {
      window.localStorage.setItem(barKey(slug), "1");
    } catch {
      /* Private mode: it hides for this page view, which is all it can do. */
    }
    document.documentElement.setAttribute("data-bar-dismissed", "");
    setHidden(true);
  }

  if (hidden) return null;

  return (
    // on-dark, so the global focus ring is drawn in the colour meant for ink.
    <div className="announce on-dark" role="region" aria-label="Announcement">
      <a ref={box} href={href} className="announce-link" aria-label={label}>
        {/* The probe is the full line at its natural width, measured to decide
            whether it fits. It is never seen. */}
        <span ref={probe} className="announce-probe" aria-hidden="true">
          {line}
        </span>

        {mode === "marquee" ? (
          <span className="announce-track" aria-hidden="true">
            {/* Two copies, each followed by a brass bullet, scrolled by half:
                the second arrives exactly where the first began, so there is
                no seam. */}
            <span className="announce-copy">{line}</span>
            <span className="announce-sep">&bull;</span>
            <span className="announce-copy">{line}</span>
            <span className="announce-sep">&bull;</span>
          </span>
        ) : (
          <span className="announce-static" aria-hidden="true">
            {mode === "short" ? shortLine : line}
          </span>
        )}
      </a>

      <button
        type="button"
        className="announce-dismiss"
        onClick={dismiss}
        aria-label="Dismiss this announcement"
      >
        <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
          <path
            d="M2 2l6 6M8 2l-6 6"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
