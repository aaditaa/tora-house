"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The cover ground, moving. It sits over the still photograph rather than
 * replacing it, so the photograph is what you get on a slow connection, with
 * reduced motion asked for, or if the file never arrives — the screen is never
 * empty while it decides.
 *
 * Nothing is fetched until after mount, and never when the viewer has asked for
 * less motion.
 */
export function CoverFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (calm.matches) return;

    const el = video.current;
    if (!el) return;
    el.src = "/video/cover.mp4";
    el.load();
    const play = () => {
      setReady(true);
      void el.play().catch(() => {
        /* Autoplay refused — the photograph underneath is already correct. */
      });
    };
    el.addEventListener("canplay", play, { once: true });
    return () => el.removeEventListener("canplay", play);
  }, []);

  return (
    <video
      ref={video}
      data-ready={ready}
      className="cover-film"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
