const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  // Meta's ad click ID. The server turns it into the fbc identifier when the
  // pixel's own cookie is missing, so a conversion can still be tied to the ad.
  "fbclid",
] as const;

const STORE = "tora-attribution";

function fromUrl(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 500);
  }
  return found;
}

/**
 * Called once per page load. Keeps the campaign tags of the visit's landing page
 * for the rest of the visit, so someone who arrives from an ad, reads About and
 * comes back to book is still counted against that ad.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const found = fromUrl();
    if (Object.keys(found).length > 0 && !sessionStorage.getItem(STORE)) {
      sessionStorage.setItem(STORE, JSON.stringify(found));
    }
  } catch {
    /* Private mode: the tags are still read off the URL at submit time. */
  }
}

/** The visit's campaign tags: the landing page's, else the current URL's. */
export function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORE) ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    stored = {};
  }
  const utm = { ...fromUrl(), ...stored };
  return Object.keys(utm).length > 0 ? utm : undefined;
}

export function readReferrer(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.referrer ? document.referrer.slice(0, 2000) : undefined;
}
