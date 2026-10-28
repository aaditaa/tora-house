import { NextResponse } from "next/server";

import { upsertApplication } from "@/db/queries";
import { sendApplicantEmail, sendApplicationNotification } from "@/lib/email";
import { allow, clientIp } from "@/lib/rate-limit";
import { MIN_FILL_MS, applicationPayloadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!allow(`apply:${clientIp(request)}`)) {
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

  const parsed = applicationPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const data = parsed.data;

  // A filled honeypot, or a form completed faster than any person could, gets a
  // plain success. The bot learns nothing and nothing is written.
  const tooFast = Date.now() - data.form_opened_at < MIN_FILL_MS;
  if ((data.website && data.website.length > 0) || tooFast) {
    return NextResponse.json({ ok: true });
  }

  let saved: { id: string; duplicate: boolean };
  try {
    saved = await upsertApplication({
      email: data.email,
      phone: data.phone ?? null,
      hearMore: data.hear_more,
      ageBand: data.age_band,
      city: data.city,
      interests: data.interests,
      practicesToday: data.practices_today,
      workoutMode: data.workout_mode,
      recentAttempts: data.recent_attempts,
      whatInterrupts: data.what_interrupts,
      spendBand: data.spend_band,
      yearFromNow: data.year_from_now,
      // Always true now. She gave an address for one stated purpose \u2014 so that we
      // can come back to her about these answers \u2014 and the form says so next to
      // the field. hear_more is the separate, optional thing she chose.
      consentContact: true,
      utm: data.utm ?? null,
      referrer: data.referrer ?? null,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
  } catch (error) {
    console.error("[apply] database write failed", error);
    return NextResponse.json(
      { ok: false, error: "Your answers could not be saved." },
      { status: 500 },
    );
  }

  // The record is stored, which is what matters. A failed send is logged, not raised.
  try {
    const notify = sendApplicationNotification({
      id: saved.id,
      email: data.email,
      phone: data.phone ?? null,
      hearMore: data.hear_more,
      ageBand: data.age_band,
      city: data.city,
      interests: data.interests,
      practicesToday: data.practices_today,
      workoutMode: data.workout_mode,
      recentAttempts: data.recent_attempts,
      whatInterrupts: data.what_interrupts,
      spendBand: data.spend_band,
      yearFromNow: data.year_from_now,
    });

    await Promise.all([notify, sendApplicantEmail(data.email)]);
  } catch (error) {
    console.error("[apply] email send failed", error);
  }

  return NextResponse.json({ ok: true, duplicate: saved.duplicate });
}
