import { Resend } from "resend";

import { BRAND_NAME, guideNameLabel } from "@/lib/config";
import { env } from "@/lib/env";
import {
  formatInr,
  formatWhen,
  numberWord,
  plain,
  type ImmersionEvent,
} from "@/lib/immersions";

let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(env().RESEND_API_KEY);
  return client;
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

// ─── Immersions ─────────────────────────────────────────────────────────────

type ImmersionBookingSummary = {
  id: string;
  duplicate: boolean;
  fullName: string;
  email: string;
  phone: string | null;
  seats: number;
  dietary: string | null;
  heard: string | null;
  memberStatus: string;
  ev: ImmersionEvent;
};

/**
 * Her confirmation. A request, honestly described: the seat is hers once it is
 * paid, and payment happens on Razorpay's page, never in a reply to this.
 */
export async function sendImmersionConfirmation(
  to: string,
  firstName: string,
  ev: ImmersionEvent,
  seats: number,
) {
  const when = plain(formatWhen(ev, { range: true }));
  const total = formatInr(ev.priceInr * seats);
  const seatLine =
    seats === 1
      ? `One seat, ${total}.`
      : `${numberWord(seats)} seats, ${total} in all.`;
  const pay = ev.paymentUrl
    ? `Your seat is held once it is paid. You can pay here, on Razorpay's page: ${ev.paymentUrl}`
    : "Your seat is held once it is paid. The link to pay follows from us by email.";

  await resend().emails.send({
    from: env().FROM_EMAIL,
    to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `Your request: ${ev.title}, ${plain(formatWhen(ev))}`,
    text: [
      `${firstName},`,
      "",
      `Your request for ${ev.title} is in: ${when}, at ${ev.venue}. ${seatLine}`,
      "",
      pay,
      "",
      "If anything needs to change, reply to this message.",
      "",
      guideNameLabel(),
    ].join("\n"),
  });
}

/**
 * The team's copy, triageable from a lock screen: name, seats and member status
 * in the subject, because the member status is the field that says whether the
 * immersion is bringing new people in.
 */
export async function sendImmersionNotification(b: ImmersionBookingSummary) {
  const rule = "----------------------------------------";
  const seats = `${b.seats} ${b.seats === 1 ? "seat" : "seats"}`;
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: env().NOTIFY_EMAIL,
    replyTo: b.email,
    subject: `Immersion: ${b.fullName}, ${seats}, ${b.memberStatus}${b.duplicate ? " (updated)" : ""}`,
    text: [
      `${b.ev.title}, ${plain(formatWhen(b.ev, { range: true }))}`,
      rule,
      `Name:       ${b.fullName}`,
      `Email:      ${b.email}`,
      `Phone:      ${b.phone ?? "not given"}`,
      `Seats:      ${b.seats}`,
      `Member:     ${b.memberStatus}`,
      `Food:       ${b.dietary ?? "nothing noted"}`,
      `Heard via:  ${b.heard ?? "not given"}`,
      rule,
      b.duplicate
        ? "She had already asked; this updated her request rather than adding a second."
        : "A new request. It holds a seat only once it is marked paid:",
      `  update immersion_bookings set status = 'paid' where id = '${b.id}';`,
    ].join("\n"),
  });
}
