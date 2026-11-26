import { NextResponse } from "next/server";

import { recordPayment } from "@/lib/payments";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

type WebhookEvent = {
  event?: string;
  payload?: {
    payment_link?: { entity?: { id?: string } };
    payment?: { entity?: { id?: string } };
  };
};

/**
 * Razorpay calls this when a payment link is paid. Set it up in the Razorpay
 * dashboard under Account & Settings, Webhooks: this URL, the
 * payment_link.paid event, and a secret that is also RAZORPAY_WEBHOOK_SECRET here.
 *
 * Nothing is trusted until the signature checks out against the raw body. Any
 * other event is acknowledged and ignored. A database failure returns 500, so
 * Razorpay retries it later.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifyWebhookSignature(raw, signature, secret)) {
    return NextResponse.json(
      { ok: false, error: "signature" },
      { status: 400 },
    );
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(raw) as WebhookEvent;
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }

  if (event.event !== "payment_link.paid") {
    return NextResponse.json({ ok: true, ignored: event.event ?? null });
  }
  const linkId = event.payload?.payment_link?.entity?.id;
  const paymentId = event.payload?.payment?.entity?.id ?? null;
  if (!linkId) {
    return NextResponse.json({ ok: true, ignored: "no_link" });
  }

  try {
    const outcome = await recordPayment(linkId, paymentId);
    if (outcome === "unknown") {
      console.error("[webhook] paid link matches no booking", linkId);
    }
    return NextResponse.json({ ok: true, outcome });
  } catch (error) {
    console.error("[webhook] could not record payment", error);
    return NextResponse.json({ ok: false, error: "retry" }, { status: 500 });
  }
}
