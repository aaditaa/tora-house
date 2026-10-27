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
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      ageBand: data.age_band,
      occupation: data.occupation,
      recentAttempts: data.recent_attempts,
      whatInterrupts: data.what_interrupts,
      spendBand: data.spend_band,
      yearFromNow: data.year_from_now,
      trainsCompetitively: data.trains_competitively,
      referralSource: data.referral_source,
      offlineAvailability: data.offline_availability,
      notes: data.notes?.trim() ? data.notes : null,
      consentContact: data.consent_contact,
      researchOptin: data.research_optin,
      utm: data.utm ?? null,
      referrer: data.referrer ?? null,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
  } catch (error) {
    console.error("[apply] database write failed", error);
    return NextResponse.json(
      { ok: false, error: "Your application could not be saved." },
      { status: 500 },
    );
  }

  // The record is stored, which is what matters. A failed send is logged, not raised.
  try {
    await Promise.all([
      sendApplicantEmail(data.email, firstName(data.full_name)),
      sendApplicationNotification({
        id: saved.id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        ageBand: data.age_band,
        occupation: data.occupation,
        recentAttempts: data.recent_attempts,
        whatInterrupts: data.what_interrupts,
        spendBand: data.spend_band,
        yearFromNow: data.year_from_now,
        trainsCompetitively: data.trains_competitively,
        referralSource: data.referral_source,
        offlineAvailability: data.offline_availability,
        notes: data.notes ?? null,
        consentContact: data.consent_contact,
        researchOptin: data.research_optin,
      }),
    ]);
  } catch (error) {
    console.error("[apply] email send failed", error);
  }

  return NextResponse.json({ ok: true, duplicate: saved.duplicate });
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full.trim();
}
