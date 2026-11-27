import { createHash } from "node:crypto";

/**
 * Meta's Conversions API: the server's copy of the events that matter most. A
 * browser that blocks the pixel, or a payment confirmed only by Razorpay's
 * webhook, is still counted. Each event carries the same ID as its browser twin,
 * so Meta keeps one.
 *
 *   NEXT_PUBLIC_META_PIXEL_ID   the pixel these events belong to
 *   META_CAPI_ACCESS_TOKEN      Events Manager → Settings → Conversions API →
 *                               Generate access token. Secret.
 *   META_TEST_EVENT_CODE        optional: while set, events show under Test
 *                               events in Events Manager. Remove it after testing.
 *
 * Without the first two, nothing is sent. Email, phone and name are hashed
 * (SHA-256) before they leave; Meta only ever receives the hashes.
 */

// An expired Graph API version is answered by the oldest live one, so this does
// not break when it ages; it is worth moving forward now and then.
const GRAPH = "https://graph.facebook.com/v23.0";

function config(): { pixelId: string; token: string } | null {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  return pixelId && token ? { pixelId, token } : null;
}

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

/** What Meta can use to match an event to a person, all optional. */
export type MetaUser = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

export type ServerEvent = {
  name: "Lead" | "AddPaymentInfo" | "Purchase";
  /** The same ID the browser used, so the two are counted once. */
  id: string;
  sourceUrl: string;
  user: MetaUser;
  custom?: Record<string, string | number>;
  time?: Date;
};

export async function sendMetaEvent(e: ServerEvent): Promise<void> {
  const c = config();
  if (!c) return;

  const u = e.user;
  const user_data: Record<string, string | string[]> = {};
  if (u.email) {
    const em = sha(u.email.trim().toLowerCase());
    user_data.em = [em];
    // The same person across the waitlist, a booking and a payment.
    user_data.external_id = [em];
  }
  if (u.phone) {
    const digits = u.phone.replace(/\D/g, "");
    if (digits) user_data.ph = [sha(digits)];
  }
  if (u.firstName?.trim())
    user_data.fn = [sha(u.firstName.trim().toLowerCase())];
  if (u.ip) user_data.client_ip_address = u.ip;
  if (u.userAgent) user_data.client_user_agent = u.userAgent;
  if (u.fbp) user_data.fbp = u.fbp;
  if (u.fbc) user_data.fbc = u.fbc;

  const testCode = process.env.META_TEST_EVENT_CODE?.trim();
  const response = await fetch(`${GRAPH}/${c.pixelId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: e.name,
          event_time: Math.floor((e.time ?? new Date()).getTime() / 1000),
          event_id: e.id,
          event_source_url: e.sourceUrl,
          action_source: "website",
          user_data,
          custom_data: e.custom ?? {},
        },
      ],
      ...(testCode ? { test_event_code: testCode } : {}),
      access_token: c.token,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    throw new Error(
      `Meta Conversions API ${response.status}: ${await response.text()}`,
    );
  }
}

/** Sends, and logs a failure rather than throwing: tracking never breaks a form. */
export async function sendMetaEventQuietly(e: ServerEvent): Promise<void> {
  try {
    await sendMetaEvent(e);
  } catch (error) {
    console.error(`[meta] ${e.name} not sent`, error);
  }
}

function cookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

/**
 * The browser identifiers on a request: the pixel's _fbp and _fbc cookies, the
 * IP and the user agent. If the pixel was blocked but she arrived from an ad,
 * the ad's click ID still gives an fbc.
 */
export function requestUser(
  headers: Headers,
  fbclid?: string | null,
): Pick<MetaUser, "ip" | "userAgent" | "fbp" | "fbc"> {
  const raw = headers.get("cookie");
  const forwarded = headers.get("x-forwarded-for");
  const fbc =
    cookie(raw, "_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null);
  return {
    ip: forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip"),
    userAgent: headers.get("user-agent"),
    fbp: cookie(raw, "_fbp"),
    fbc,
  };
}
