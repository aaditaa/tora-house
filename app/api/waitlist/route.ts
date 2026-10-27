import { NextResponse } from "next/server";

import { upsertWaitlistEntry } from "@/db/queries";
import { sendWaitlistEmail } from "@/lib/email";
import { allow, clientIp } from "@/lib/rate-limit";
import { MIN_FILL_MS, waitlistPayloadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!allow(`waitlist:${clientIp(request)}`)) {
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

  const parsed = waitlistPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const data = parsed.data;
  const tooFast = Date.now() - data.form_opened_at < MIN_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  const source =
    typeof (body as { source?: unknown }).source === "string"
      ? String((body as { source?: unknown }).source).slice(0, 60)
      : null;

  try {
    await upsertWaitlistEntry({
      fullName: data.full_name,
      email: data.email,
      city: data.city,
      note: data.note?.trim() ? data.note : null,
      consentContact: data.consent_contact,
      source,
      utm: data.utm ?? null,
      referrer: data.referrer ?? null,
    });
  } catch (error) {
    console.error("[waitlist] database write failed", error);
    return NextResponse.json(
      { ok: false, error: "You could not be added to the list." },
      { status: 500 },
    );
  }

  // Joins are notified to the team as a daily digest, not one at a time.
  try {
    await sendWaitlistEmail(
      data.email,
      data.full_name.trim().split(/\s+/)[0] ?? data.full_name,
    );
  } catch (error) {
    console.error("[waitlist] email send failed", error);
  }

  return NextResponse.json({ ok: true });
}
