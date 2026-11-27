"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The venue film: autoplay, muted, looped, inline, with its poster showing until
 * the first frame. React sets `muted` as a property after the markup arrives,
 * which iOS Safari can miss when deciding whether autoplay is allowed, so it is
 * set again here and play() asked for explicitly. Under reduced motion it stays
 * on the poster.
 *
 * `lazy` holds the file back until the film is about to scroll into view, for
 * the home page, where it sits far below the first screen.
 */
export function VenueVideo({
  src,
  poster,
  label,
  lazy = false,
}: {
  src: string;
  poster: string;
  label: string;
  lazy?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(!lazy);

  useEffect(() => {
    if (near) return;
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !near) return;
    v.muted = true;
    v.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {
      /* Autoplay refused (low-power mode, data saver): the poster stays. */
    });
  }, [near]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      // Lazy: no poster either until near, so it costs nothing at page load.
      poster={near ? poster : undefined}
      width={960}
      height={720}
      autoPlay={near}
      muted
      loop
      playsInline
      preload={near ? "metadata" : "none"}
      aria-label={label}
    />
  );
}
