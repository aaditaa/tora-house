"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

import { META_PIXEL_ID, pixelBootstrap, track } from "@/lib/meta";
import { captureAttribution } from "@/lib/utm";

/**
 * Mounted once, in the root layout, so every page carries the pixel: the home
 * page, About, Privacy, Terms, every demo screen and the payment return page.
 * The base code sends the first PageView; this sends one more for every move to
 * another page after that. A change of #section is not a new page.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    if (last.current === null || last.current === pathname) {
      last.current = pathname;
      return;
    }
    last.current = pathname;
    track("PageView");
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: pixelBootstrap(META_PIXEL_ID) }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(META_PIXEL_ID)}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

/** Fires one event the first time its marker scrolls into view. */
export function TrackOnView({
  event,
  params,
}: {
  event: "ViewContent";
  params: Record<string, string | number>;
}) {
  const marker = useRef<HTMLSpanElement>(null);
  const key = JSON.stringify(params);

  useEffect(() => {
    const el = marker.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track(event, JSON.parse(key) as Record<string, string | number>);
          observer.disconnect();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [event, key]);

  return <span ref={marker} aria-hidden="true" className="block h-px" />;
}

/** Fires one event when it mounts: the confirmed-payment page uses it. */
export function TrackOnce({
  event,
  params,
  eventId,
}: {
  event: "Purchase";
  params: Record<string, string | number>;
  eventId: string;
}) {
  const sent = useRef(false);
  const key = JSON.stringify(params);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, JSON.parse(key) as Record<string, string | number>, eventId);
  }, [event, key, eventId]);
  return null;
}
