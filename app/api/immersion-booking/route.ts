import { NextResponse } from "next/server";

import { upsertImmersionBooking } from "@/db/queries";
import {
  sendImmersionConfirmation,
  sendImmersionNotification,
} from "@/lib/email";
import { immersions, startOf } from "@/lib/immersions";
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
    return NextResponse.json({ ok: true });
  }

  // The server's checks, not the browser's: the event exists, has not started,
  // and has room for this many seats.
  const ev = immersions.find((x) => x.slug === data.immersion_slug);
  if (!ev || startOf(ev).getTime() <= Date.now()) {
    return NextResponse.json({ ok: false, error: "closed" }, { status: 409 });
  }
  const left = await seatsLeft(ev);
  if (left !== null && data.seats > left) {
    return NextResponse.json({ ok: false, error: "full" }, { status: 409 });
  }

  const source =
    typeof (body as { source?: unknown }).source === "string"
      ? String((body as { source?: unknown }).source).slice(0, 60)
      : null;
  const phone = data.phone && data.phone.length > 0 ? data.phone : null;
  const blank = (v: string | undefined) => (v?.trim() ? v.trim() : null);

  let result;
  try {
    result = await upsertImmersionBooking({
      immersionSlug: ev.slug,
      fullName: data.full_name,
      email: data.email,
      phone,
      seats: data.seats,
      dietary: blank(data.dietary),
      heard: blank(data.heard),
      memberStatus: MEMBER_CODE[data.member_status],
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

  // A failed email never loses a booking: the row is already written.
  const firstName =
    data.full_name.trim().split(/\s+/)[0] ?? data.full_name.trim();
  const sends = await Promise.allSettled([
    sendImmersionConfirmation(data.email, firstName, ev, data.seats),
    sendImmersionNotification({
      id: result.id,
      duplicate: result.duplicate,
      fullName: data.full_name.trim(),
      email: data.email,
      phone,
      seats: data.seats,
      dietary: blank(data.dietary),
      heard: blank(data.heard),
      memberStatus: data.member_status,
      ev,
    }),
  ]);
  for (const s of sends) {
    if (s.status === "rejected") {
      console.error("[immersion] email send failed", s.reason);
    }
  }

  return NextResponse.json({ ok: true });
}
