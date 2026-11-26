import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay, server-side only. Payment happens on Razorpay's own hosted page: this
 * site makes a payment link for each booking, sends her to it, and is told when
 * it has been paid. No card or bank detail ever passes through here.
 *
 * Three variables, all optional so the site still builds and books without them:
 *   RAZORPAY_KEY_ID          rzp_test_… or rzp_live_…
 *   RAZORPAY_KEY_SECRET      the secret shown once beside it
 *   RAZORPAY_WEBHOOK_SECRET  the secret typed in when the webhook was added
 * Without the first two, a booking is saved with no link and the confirmation
 * says the link to pay follows by email, which is how it worked before.
 */

const API = "https://api.razorpay.com/v1";

function keys(): { id: string; secret: string } | null {
  const id = process.env.RAZORPAY_KEY_ID?.trim();
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  return id && secret ? { id, secret } : null;
}

export function razorpayConfigured(): boolean {
  return keys() !== null;
}

function authHeader(k: { id: string; secret: string }): string {
  return `Basic ${Buffer.from(`${k.id}:${k.secret}`).toString("base64")}`;
}

export type PaymentLink = { id: string; url: string };

/**
 * One link for one booking, for exactly what that booking costs. Her name, email
 * and number are filled in on Razorpay's page so she only has to pay. Razorpay
 * also sends her the link by email (and by text, if she gave a number), which
 * matters while this site's own emails are on a shared sender.
 */
export async function createPaymentLink(input: {
  amountInr: number;
  description: string;
  /** Unique per link, at most 40 characters. */
  referenceId: string;
  expireBy: Date;
  callbackUrl: string;
  customer: { name: string; email: string; contact: string | null };
  notes: Record<string, string>;
}): Promise<PaymentLink> {
  const k = keys();
  if (!k) throw new Error("Razorpay keys are not set");

  const response = await fetch(`${API}/payment_links`, {
    method: "POST",
    headers: {
      Authorization: authHeader(k),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(input.amountInr * 100),
      currency: "INR",
      accept_partial: false,
      description: input.description.slice(0, 2048),
      reference_id: input.referenceId.slice(0, 40),
      expire_by: Math.floor(input.expireBy.getTime() / 1000),
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        ...(input.customer.contact ? { contact: input.customer.contact } : {}),
      },
      notify: { email: true, sms: Boolean(input.customer.contact) },
      reminder_enable: false,
      notes: input.notes,
      callback_url: input.callbackUrl,
      callback_method: "get",
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `Razorpay payment link failed: ${response.status} ${await response.text()}`,
    );
  }
  const body = (await response.json()) as { id?: string; short_url?: string };
  if (!body.id || !body.short_url) {
    throw new Error("Razorpay payment link response had no id or short_url");
  }
  return { id: body.id, url: body.short_url };
}

/**
 * Closes a link that has been replaced, so an older amount cannot be paid after a
 * newer one was issued. Best effort: a link that has already lapsed cannot be
 * paid anyway.
 */
export async function cancelPaymentLink(id: string): Promise<void> {
  const k = keys();
  if (!k) return;
  const response = await fetch(
    `${API}/payment_links/${encodeURIComponent(id)}/cancel`,
    {
      method: "POST",
      headers: { Authorization: authHeader(k) },
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Razorpay cancel failed: ${response.status} ${await response.text()}`,
    );
  }
}

function sameHex(expected: string, given: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * A webhook is genuine only if X-Razorpay-Signature is the HMAC-SHA256 of the raw
 * body under the webhook secret. Anything else is ignored, whatever it claims.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return sameHex(expected, signature.trim());
}

/**
 * When she comes back from Razorpay's page, the query string carries a signature
 * over the link id, reference, status and payment id, made with the key secret.
 * Checking it is what lets the return page say "paid" and mean it.
 */
export function verifyReturnSignature(p: {
  paymentLinkId: string;
  referenceId: string;
  status: string;
  paymentId: string;
  signature: string;
}): boolean {
  const k = keys();
  if (!k || !p.signature) return false;
  const payload = `${p.paymentLinkId}|${p.referenceId}|${p.status}|${p.paymentId}`;
  const expected = createHmac("sha256", k.secret).update(payload).digest("hex");
  return sameHex(expected, p.signature.trim());
}
