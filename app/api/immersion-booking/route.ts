import { NextResponse } from "next/server";

import {
  findImmersionBooking,
  setBookingPaymentLink,
  upsertImmersionBooking,
  type ImmersionBookingRow,
} from "@/db/queries";
import { SITE_URL } from "@/lib/config";
import {
  sendImmersionConfirmation,
  sendImmersionNotification,
} from "@/lib/email";
import {
  formatWhen,
  immersions,
  plain,
  priceFor,
  startOf,
  type ImmersionEvent,
} from "@/lib/immersions";
import {
  cancelPaymentLink,
  createPaymentLink,
  razorpayConfigured,
} from "@/lib/razorpay";
import { allow, clientIp } from "@/lib/rate-limit";
import {
  MEMBER_STATUS,
  MIN_FILL_MS,
  immersionBookingPayloadSchema,
} from "@/lib/schemas";
import { seatsLeft } from "@/lib/seats";

export const runtime = "nodejs";

/** Stored as codes so the column survives a change of wording on the form. */
const MEMBER_CODE: Record<(typeof MEMBER_STATUS)[number], string> = {
  "Not a member yet": "not_member",
  "On the waitlist": "waitlist",
  "A member": "member",
};

/** How long an unpaid request holds its seats, and how long its link stays open. */
const HOLD_MS = 2 * 60 * 60 * 1000;
/** Razorpay will not make a link that closes sooner than this. */
const MIN_LINK_MS = 16 * 60 * 1000;
/** An existing link is handed back only if it has at least this long left. */
const REUSE_MARGIN_MS = 10 * 60 * 1000;

/** Two hours, or until the session starts if that comes first. */
function holdUntilFor(ev: ImmersionEvent, now: number): Date {
  const until = Math.min(now + HOLD_MS, startOf(ev).getTime());
  return new Date(Math.max(until, now + MIN_LINK_MS));
}

/** Her open link, if it is still good for exactly this booking. */
function reusableLink(
  existing: ImmersionBookingRow | null,
  seats: number,
  amount: number,
  now: number,
): { url: string; holdUntil: Date } | null {
  if (
    existing?.status === "requested" &&
    existing.paymentLinkUrl &&
    existing.holdUntil &&
    existing.holdUntil.getTime() > now + REUSE_MARGIN_MS &&
    existing.seats === seats &&
    existing.amountInr === amount
  ) {
    return { url: existing.paymentLinkUrl, holdUntil: existing.holdUntil };
  }
  return null;
}

export async function POST(request: Request) {
  if (!allow(`immersion:${clientIp(request)}`)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }

  const parsed = immersionBookingPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const data = parsed.data;

  // Bots get a quiet success and no row, exactly as the waitlist does.
  const tooFast = Date.now() - data.form_opened_at < MIN_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true, payUrl: null });
  }

  // The server's checks, not the browser's: the event exists, has not started,
  // has a price for this many seats, and has room for them.
  const ev = immersions.find((x) => x.slug === data.immersion_slug);
  if (!ev || startOf(ev).getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: "closed" }, { status: 409 });
  }
  const amount = priceFor(ev, data.seats);
  if (amount === null) {
    return NextResponse.json({ ok: false, error: "seats" }, { status: 422 });
  }

  let existing: ImmersionBookingRow | null;
  try {
    existing = await findImmersionBooking(ev.slug, data.email);
  } catch (error) {
    console.error("[immersion] lookup failed", error);
    return NextResponse.json(
      { ok: false, error: "Your request could not be saved." },
      { status: 500 },
    );
  }

  // Already paid: nothing here changes a paid booking. She replies to her
  // confirmation to change it, and a person does it.
  if (existing?.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true, payUrl: null });
  }

  // Her own current hold is not counted against her.
  const left = await seatsLeft(ev, existing?.id ?? null);
  if (left !== null && data.seats > left) {
    return NextResponse.json({ ok: false, error: "full" }, { status: 409 });
  }

  const source =
    typeof (body as { source?: unknown }).source === "string"
      ? String((body as { source?: unknown }).source).slice(0, 60)
      : null;
  const phone = data.phone && data.phone.length > 0 ? data.phone : null;
  const blank = (v: string | undefined) => (v?.trim() ? v.trim() : null);
  const fullName = data.full_name.trim();

  let result;
  try {
    result = await upsertImmersionBooking({
      immersionSlug: ev.slug,
      fullName,
      email: data.email,
      phone,
      seats: data.seats,
      dietary: blank(data.dietary),
      heard: blank(data.heard),
      memberStatus: MEMBER_CODE[data.member_status],
      amountInr: amount,
      source,
      utm: data.utm ?? null,
      referrer: data.referrer ?? null,
    });
  } catch (error) {
    console.error("[immersion] database write failed", error);
    return NextResponse.json(
      { ok: false, error: "Your request could not be saved." },
      { status: 500 },
    );
  }

  // The link. Reused if she already has a good one for this exact booking;
  // otherwise a new one, and the old one is closed so it cannot be paid as well.
  // A failure here never loses the booking: it is saved, and the confirmation
  // says the link follows by email.
  const now = Date.now();
  let pay = reusableLink(existing, data.seats, amount, now);
  if (!pay && razorpayConfigured()) {
    try {
      if (existing?.paymentLinkId) {
        await cancelPaymentLink(existing.paymentLinkId).catch((error) =>
          console.error("[immersion] could not close the old link", error),
        );
      }
      const holdUntil = holdUntilFor(ev, now);
      const seatsText = data.seats === 1 ? "1 seat" : `${data.seats} seats`;
      const link = await createPaymentLink({
        amountInr: amount,
        description: `${ev.title}, ${plain(formatWhen(ev, { range: true }))}, ${ev.venue}. ${seatsText}.`,
        referenceId: `${result.id.slice(0, 8)}-${now.toString(36)}`,
        expireBy: holdUntil,
        callbackUrl: `${SITE_URL}/booking/paid`,
        customer: { name: fullName, email: data.email, contact: phone },
        notes: {
          booking_id: result.id,
          immersion: ev.slug,
          seats: String(data.seats),
        },
      });
      await setBookingPaymentLink(result.id, {
        id: link.id,
        url: link.url,
        holdUntil,
      });
      pay = { url: link.url, holdUntil };
    } catch (error) {
      console.error("[immersion] payment link failed", error);
    }
  }

  // A failed email never loses a booking: the row is already written.
  const firstName = fullName.split(/\s+/)[0] ?? fullName;
  const sends = await Promise.allSettled([
    sendImmersionConfirmation({
      to: data.email,
      firstName,
      ev,
      seats: data.seats,
      amount,
      pay,
    }),
    sendImmersionNotification({
      id: result.id,
      duplicate: result.duplicate,
      fullName,
      email: data.email,
      phone,
      seats: data.seats,
      amount,
      dietary: blank(data.dietary),
      heard: blank(data.heard),
      memberStatus: data.member_status,
      ev,
      pay,
    }),
  ]);
  for (const s of sends) {
    if (s.status === "rejected") {
      console.error("[immersion] email send failed", s.reason);
    }
  }

  return NextResponse.json({
    ok: true,
    amount,
    payUrl: pay?.url ?? null,
    holdUntil: pay?.holdUntil.toISOString() ?? null,
  });
}
