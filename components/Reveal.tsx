"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger within a group, in ms. 80ms down the page, 120ms between hero lines. */
  delay?: number;
  /**
   * span where the parent only allows phrasing content, such as a headline line;
   * li where the parent is a real list and a wrapper div would break it.
   */
  as?: "div" | "span" | "p" | "li";
};

/**
 * The only motion pattern on the site: fade from 0 to 1 and rise 16px, once, at 15%
 * visibility, 700ms. Elements already in view when the page loads reveal immediately,
 * which is what gives the hero its staggered entrance.
 *
 * The hiding class is added on mount rather than rendered on the server, so a visitor
 * whose JavaScript never runs — or whose hydration fails — sees the content rather
 * than a blank page. It is a transition rather than an animation for the same reason:
 * the revealed state is a plain computed style, so even a browser that refuses to run
 * the transition ends up showing the content.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    el.classList.add("reveal");
    el.dataset.revealed = "false";

    // A block taller than the viewport can never reach 15%, so scale the threshold.
    const reachable = Math.min(
      0.15,
      (window.innerHeight * 0.4) / Math.max(el.offsetHeight, 1),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.revealed = "true";
            observer.disconnect();
          }
        }
      },
      { threshold: Math.max(reachable, 0.01) },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  if (as === "span") {
    return (
      <span
        ref={ref as RefObject<HTMLSpanElement>}
        className={className}
        style={style}
      >
        {children}
      </span>
    );
  }

  if (as === "p") {
    return (
      <p
        ref={ref as RefObject<HTMLParagraphElement>}
        className={className}
        style={style}
      >
        {children}
      </p>
    );
  }

  if (as === "li") {
    return (
      <li
        ref={ref as RefObject<HTMLLIElement>}
        className={className}
        style={style}
      >
        {children}
      </li>
    );
  }

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
