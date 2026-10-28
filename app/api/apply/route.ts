import { NextResponse } from "next/server";

import { upsertApplication } from "@/db/queries";
import { sendApplicantEmail, sendApplicationNotification } from "@/lib/email";
import { allow, clientIp } from "@/lib/rate-limit";
import {
  MIN_FILL_MS,
  applicationPayloadSchema,
  consentFromNextSteps,
  researchOptinFromNextSteps,
  wantsContact,
} from "@/lib/schemas";

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

  const contactWanted = wantsContact(data.next_steps);

  let saved: { id: string; duplicate: boolean };
  try {
    saved = await upsertApplication({
      fullName: data.full_name ?? null,
      email: data.email ?? null,
      ageBand: data.age_band,
      city: data.city,
      interests: data.interests,
      practicesToday: data.practices_today,
      workoutMode: data.workout_mode,
      recentAttempts: data.recent_attempts,
      whatInterrupts: data.what_interrupts,
      spendBand: data.spend_band,
      yearFromNow: data.year_from_now,
      nextSteps: data.next_steps,
      consentContact: consentFromNextSteps(data.next_steps),
      researchOptin: researchOptinFromNextSteps(data.next_steps),
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
      fullName: data.full_name ?? null,
      email: data.email ?? null,
      ageBand: data.age_band,
      city: data.city,
      interests: data.interests,
      practicesToday: data.practices_today,
      workoutMode: data.workout_mode,
      recentAttempts: data.recent_attempts,
      whatInterrupts: data.what_interrupts,
      spendBand: data.spend_band,
      yearFromNow: data.year_from_now,
      nextSteps: data.next_steps,
    });

    // Nothing is sent to a woman who asked for nothing and gave no address.
    const confirm =
      contactWanted && data.email
        ? sendApplicantEmail(
            data.email,
            firstName(data.full_name ?? data.email),
          )
        : Promise.resolve();

    await Promise.all([notify, confirm]);
  } catch (error) {
    console.error("[apply] email send failed", error);
  }

  return NextResponse.json({
    ok: true,
    duplicate: saved.duplicate,
    contactWanted,
  });
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full.trim();
}
