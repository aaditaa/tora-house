const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Reads UTM parameters off the current URL. Returns undefined when there are none. */
export function readUtm(): Record<string, string> | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  return Object.keys(utm).length > 0 ? utm : undefined;
}

export function readReferrer(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.referrer ? document.referrer.slice(0, 2000) : undefined;
}
