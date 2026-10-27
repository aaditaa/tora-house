import { Resend } from "resend";

import { BRAND_NAME, guideNameLabel } from "@/lib/config";
import { env } from "@/lib/env";

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(env().RESEND_API_KEY);
  return client;
}

type ApplicationSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ageBand: string;
  occupation: string;
  recentAttempts: string;
  whatInterrupts: string;
  spendBand: string;
  yearFromNow: string;
  trainsCompetitively: boolean;
  referralSource: string;
  offlineAvailability: string;
  notes: string | null;
  consentContact: boolean;
  researchOptin: boolean;
};

/**
 * A transactional reply to an application. No marketing, no logo banner, no
 * unsubscribe language — it should read like a person sent it, because one will be
 * reading the answers.
 */
export async function sendApplicantEmail(to: string, firstName: string) {
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `Your application to ${BRAND_NAME}`,
    text: [
      `${firstName},`,
      "",
      "Your application has arrived and I have it in front of me.",
      "",
      "I read these in the order they come in, properly rather than quickly, so give me up to a week. You will hear back either way — and if it is a yes, the next step is a call rather than a form.",
      "",
      "Thank you for the answers you wrote out. The long ones are the useful ones.",
      "",
      guideNameLabel(),
    ].join("\n"),
  });
}

export async function sendWaitlistEmail(to: string, firstName: string) {
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `You are on the ${BRAND_NAME} list`,
    text: [
      `${firstName},`,
      "",
      `You are on the list. We will write when the next cohort opens, or when a chapter opens in a new city — and for nothing else. No newsletter, no offers. If you would rather come off the list at any point, reply to this message and you are off it the same day.`,
      "",
      guideNameLabel(),
    ].join("\n"),
  });
}

/** Triageable from a phone lock screen: name, city, age band in the subject. */
export async function sendApplicationNotification(a: ApplicationSummary) {
  const body = [
    `${a.fullName} — ${a.city}, ${a.ageBand}`,
    `${a.email} · ${a.phone}`,
    `Occupation: ${a.occupation}`,
    `Spend in the last year: ${a.spendBand}`,
    `Training for an event: ${a.trainsCompetitively ? "YES" : "no"}`,
    `In-person availability: ${a.offlineAvailability}`,
    `Found us via: ${a.referralSource}`,
    `Research conversation: ${a.researchOptin ? "yes, happy to be approached" : "no"}`,
    `Consent to contact and storage: ${a.consentContact ? "given" : "NOT GIVEN"}`,
    "",
    "----------------------------------------",
    "What she has tried in the last two years",
    "----------------------------------------",
    a.recentAttempts,
    "",
    "----------------------------------------",
    "What gets in the way when something stops",
    "----------------------------------------",
    a.whatInterrupts,
    "",
    "----------------------------------------",
    "What she wants to be true a year from now",
    "----------------------------------------",
    a.yearFromNow,
    "",
    "----------------------------------------",
    "Anything else she wanted us to know",
    "----------------------------------------",
    a.notes?.trim() ? a.notes : "(nothing added)",
    "",
    "----------------------------------------",
    `Row id: ${a.id}`,
  ].join("\n");

  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: env().NOTIFY_EMAIL,
    replyTo: a.email,
    subject: `Application — ${a.fullName}, ${a.city}, ${a.ageBand}`,
    text: body,
  });
}

/**
 * Waitlist joins go out once a day rather than one at a time. Individual alerts for a
 * low-intent action train you to ignore the alerts that matter.
 */
export async function sendWaitlistDigest(
  rows: {
    full_name: string;
    email: string;
    city: string;
    note: string | null;
  }[],
) {
  if (rows.length === 0) return;

  const lines = rows.map(
    (r) =>
      `${r.full_name} — ${r.city} — ${r.email}${r.note?.trim() ? `\n    "${r.note.trim()}"` : ""}`,
  );

  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: env().NOTIFY_EMAIL,
    subject: `Waitlist — ${rows.length} new ${rows.length === 1 ? "name" : "names"}`,
    text: [`In the last 24 hours:`, "", ...lines].join("\n"),
  });
}
