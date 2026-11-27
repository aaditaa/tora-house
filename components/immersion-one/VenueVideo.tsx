"use client";

import { useEffect, useRef } from "react";

/**
 * The venue film: autoplay, muted, looped, inline, with its poster showing until
 * the first frame. React sets `muted` as a property after the markup arrives,
 * which iOS Safari can miss when deciding whether autoplay is allowed, so it is
 * set again here and play() asked for explicitly. Under reduced motion it stays
 * on the poster.
 */
export function VenueVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {
      /* Autoplay refused (low-power mode, data saver): the poster stays. */
    });
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={960}
      height={720}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
