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
  email: string;
  phone: string | null;
  hearMore: boolean;
  ageBand: string;
  city: string;
  interests: readonly string[];
  practicesToday: readonly string[];
  workoutMode: string;
  recentAttempts: string;
  whatInterrupts: string;
  spendBand: string;
  yearFromNow: string;
};

/**
 * A transactional reply to someone who asked to hear back. No marketing, no logo
 * banner, no unsubscribe language — it should read like a person sent it, because one
 * will be reading the answers.
 *
 * It opens without a salutation: the form asks for an address and a number, never a
 * name, so there is none to use. Guessing one from the local part of an email reads
 * worse than not greeting at all.
 */
export async function sendApplicantEmail(to: string) {
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `Your questionnaire to ${BRAND_NAME}`,
    text: [
      "Your answers have arrived and I have them in front of me.",
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
  const who = a.email;
  const rule = "----------------------------------------";
  const list = (items: readonly string[]) =>
    items.length > 0 ? items.map((i) => `  · ${i}`).join("\n") : "  (none)";

  // The gap between these two lists is the most useful thing on the form, so put
  // it where it can be read without cross-referencing.
  const wantsNotDoing = a.interests.filter(
    (i) => !a.practicesToday.includes(i),
  );

  const body = [
    `${who} — ${a.city}, ${a.ageBand}`,
    a.phone ? `Phone: ${a.phone}` : "No phone number given.",
    a.hearMore
      ? "Ticked: interested to hear more about this."
      : "Did not tick the box about hearing more.",
    `Spend in the last year: ${a.spendBand}`,
    `How she trains: ${a.workoutMode}`,
    "",
    rule,
    "Drawn to",
    rule,
    list(a.interests),
    "",
    rule,
    "Actually doing",
    rule,
    list(a.practicesToday),
    "",
    rule,
    "The gap — drawn to, not doing",
    rule,
    list(wantsNotDoing),
    "",
    rule,
    "What she has tried in the last two years",
    rule,
    a.recentAttempts,
    "",
    rule,
    "What gets in the way when something stops",
    rule,
    a.whatInterrupts,
    "",
    rule,
    "What she wants to be true a year from now",
    rule,
    a.yearFromNow,
    "",
    rule,
    `Row id: ${a.id}`,
  ].join("\n");

  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: env().NOTIFY_EMAIL,
    replyTo: a.email,
    subject: `Questionnaire — ${who}, ${a.city}, ${a.ageBand}`,
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
