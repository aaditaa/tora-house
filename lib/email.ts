import { Resend } from "resend";

import { BRAND_NAME, guideNameLabel } from "@/lib/config";
import { env } from "@/lib/env";
import {
  formatClock,
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

type Pay = { url: string; holdUntil: Date } | null;

function seatLine(seats: number, amount: number): string {
  return seats === 1
    ? `One seat, ${formatInr(amount)}.`
    : `${numberWord(seats)} seats, ${formatInr(amount)} in all.`;
}

/**
 * Her confirmation. A request, honestly described: the seats are hers once they
 * are paid, and payment happens on Razorpay's page, never in a reply to this.
 */
export async function sendImmersionConfirmation(b: {
  to: string;
  firstName: string;
  ev: ImmersionEvent;
  seats: number;
  amount: number;
  pay: Pay;
}) {
  const when = plain(formatWhen(b.ev, { range: true }));
  const noun = b.seats === 1 ? "seat is" : "seats are";
  const pay = b.pay
    ? [
        `Your ${noun} held for you until ${formatClock(b.pay.holdUntil)}, and yours once paid. Pay ${formatInr(b.amount)} here, on Razorpay's page:`,
        b.pay.url,
        "",
        "Razorpay will also send you this link, and a receipt once you have paid.",
      ].join("\n")
    : `Your ${noun} yours once paid. The link to pay ${formatInr(b.amount)} follows from us by email.`;

  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: b.to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `Your request: ${b.ev.title}, ${plain(formatWhen(b.ev))}`,
    text: [
      `${b.firstName},`,
      "",
      `Your request for ${b.ev.title} is in: ${when}, at ${b.ev.venue}. ${seatLine(b.seats, b.amount)}`,
      "",
      pay,
      "",
      "If anything needs to change, reply to this message.",
      "",
      guideNameLabel(),
    ].join("\n"),
  });
}

type ImmersionBookingSummary = {
  id: string;
  duplicate: boolean;
  fullName: string;
  email: string;
  phone: string | null;
  seats: number;
  amount: number;
  dietary: string | null;
  heard: string | null;
  memberStatus: string;
  ev: ImmersionEvent;
  pay: Pay;
};

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
      `Amount:     ${formatInr(b.amount)}`,
      `Member:     ${b.memberStatus}`,
      `Food:       ${b.dietary ?? "nothing noted"}`,
      `Heard via:  ${b.heard ?? "not given"}`,
      rule,
      b.duplicate
        ? "She had already asked; this updated her request rather than adding a second."
        : "A new request.",
      b.pay
        ? `Payment link sent, open until ${formatClock(b.pay.holdUntil)}: ${b.pay.url}\nIt marks itself paid when Razorpay confirms. You will get a "Paid" email.`
        : "No payment link was made (Razorpay keys not set, or Razorpay refused). Send her one by hand, then mark it paid:",
      b.pay
        ? ""
        : `  update immersion_bookings set status = 'paid', paid_at = now() where id = '${b.id}';`,
    ].join("\n"),
  });
}

/** Her seat is confirmed. Razorpay sends the receipt; this says what it is for. */
export async function sendImmersionPaidConfirmation(b: {
  to: string;
  firstName: string;
  ev: ImmersionEvent;
  seats: number;
  amount: number;
}) {
  const when = plain(formatWhen(b.ev, { range: true }));
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: b.to,
    replyTo: env().NOTIFY_EMAIL,
    subject: `Confirmed: ${b.ev.title}, ${plain(formatWhen(b.ev))}`,
    text: [
      `${b.firstName},`,
      "",
      `Your payment has arrived and your place is confirmed. ${seatLine(b.seats, b.amount)}`,
      "",
      `${b.ev.title}: ${when}, at ${b.ev.venue}.`,
      "",
      "If anything needs to change, reply to this message.",
      "",
      guideNameLabel(),
    ].join("\n"),
  });
}

/** The team's "Paid", with a warning if this payment took the room over its size. */
export async function sendImmersionPaidNotification(b: {
  id: string;
  fullName: string;
  email: string;
  seats: number;
  amount: number | null;
  paymentId: string | null;
  ev: ImmersionEvent;
  overBy: number;
}) {
  const seats = `${b.seats} ${b.seats === 1 ? "seat" : "seats"}`;
  await resend().emails.send({
    from: env().FROM_EMAIL,
    to: env().NOTIFY_EMAIL,
    replyTo: b.email,
    subject: `Paid: ${b.fullName}, ${seats}${b.amount ? `, ${formatInr(b.amount)}` : ""}${b.overBy > 0 ? " (room over)" : ""}`,
    text: [
      `${b.ev.title}, ${plain(formatWhen(b.ev, { range: true }))}`,
      "",
      `${b.fullName} (${b.email}) has paid for ${seats}.`,
      `Razorpay payment: ${b.paymentId ?? "not given"}`,
      `Booking: ${b.id}`,
      b.overBy > 0
        ? `\nThis payment takes the room ${b.overBy} over its size. Two people paid for the last place at once. Refund one of them from the Razorpay dashboard.`
        : "",
    ].join("\n"),
  });
}
