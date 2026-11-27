/**
 * The Meta Pixel, browser side. Safe to import anywhere a client component runs.
 *
 * NEXT_PUBLIC_META_PIXEL_ID is the pixel's ID from Events Manager. It is public by
 * design (it appears in the page source), and it is baked in at build time, so a
 * change needs a redeploy. Without it, nothing loads and every call here is a no-op.
 *
 * The journey, as Meta's standard events:
 *   PageView        every page, and every move between pages
 *   ViewContent     the immersion section comes into view
 *   InitiateCheckout  the booking form opens
 *   AddPaymentInfo  a booking is in and the Pay step is shown
 *   Purchase        a payment is confirmed
 *   Lead            someone joins the waitlist
 * AddPaymentInfo, Purchase and Lead are also sent from the server (Conversions
 * API) with the same event ID, so Meta counts each once even when both arrive.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;

export type MetaEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Lead";

export type MetaParams = Record<string, string | number | undefined>;

type FbqArgs = [string, string, MetaParams?, { eventID: string }?];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
    /** Calls made before the pixel script has run; it replays them on load. */
    __metaPending?: FbqArgs[] | null;
    /** Development only: every event this page asked for, for checking by hand. */
    __metaEvents?: {
      event: MetaEvent;
      params?: MetaParams;
      eventId?: string;
    }[];
  }
}

/** A fresh ID for an event that is sent from both the browser and the server. */
export function newEventId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

export function track(
  event: MetaEvent,
  params?: MetaParams,
  eventId?: string,
): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {
    (window.__metaEvents ??= []).push({ event, params, eventId });
  }
  if (!META_PIXEL_ID) return;

  const args: FbqArgs = eventId
    ? ["track", event, params ?? {}, { eventID: eventId }]
    : ["track", event, params ?? {}];
  if (window.fbq) {
    window.fbq(...args);
  } else if (window.__metaPending !== null) {
    // The pixel script loads after the page is interactive; anything asked for
    // before then waits here and is sent the moment it starts.
    (window.__metaPending ??= []).push(args);
  }
}

/** The pixel's base code, plus a replay of anything queued before it ran. */
export function pixelBootstrap(pixelId: string): string {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(pixelId)});fbq('track','PageView');(window.__metaPending||[]).forEach(function(a){fbq.apply(null,a)});window.__metaPending=null;`;
}
