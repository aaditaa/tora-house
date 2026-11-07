"use client";

import { useEffect, useRef, useState } from "react";

import { Lockup } from "@/components/Brand";

/**
 * The cover of the demo. The film is generated and abstract — brass light moving
 * across a jaali screen — and it is decoration, so it never loads until it is
 * wanted and never plays for someone who has asked for less motion.
 *
 * Vetiver sits under it from the first paint, so the panel is correct whether the
 * film arrives, is refused, or is switched off.
 */
export function WelcomeFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (calm.matches) return;

    const el = video.current;
    if (!el) return;
    el.src = "/video/jaali.mp4";
    el.load();
    const play = () => {
      setReady(true);
      void el.play().catch(() => {
        /* A browser that refuses autoplay just leaves the vetiver ground. */
      });
    };
    el.addEventListener("canplay", play, { once: true });
    return () => el.removeEventListener("canplay", play);
  }, []);

  return (
    <div className="demo-film">
      <video
        ref={video}
        data-ready={ready}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <span aria-hidden="true" className="demo-film-scrim" />
      <div className="demo-film-mark on-dark">
        <Lockup variant="stacked" withTagline align="center" />
      </div>
    </div>
  );
}
