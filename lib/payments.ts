import { findBookingByLink, markBookingPaid, paidSeats } from "@/db/queries";
import {
  sendImmersionPaidConfirmation,
  sendImmersionPaidNotification,
} from "@/lib/email";
import { immersions } from "@/lib/immersions";

export type PaymentOutcome = "recorded" | "already" | "unknown";

/**
 * A payment link has been paid. Called by Razorpay's webhook and by the page she
 * returns to, whichever comes first; the second finds it already recorded and
 * sends nothing. The booking becomes paid, she gets a confirmation and the team
 * gets a "Paid" email, with a warning if two people paid for the last place.
 */
export async function recordPayment(
  paymentLinkId: string,
  paymentId: string | null,
): Promise<PaymentOutcome> {
  const booking = await markBookingPaid(paymentLinkId, paymentId);
  if (!booking) {
    return (await findBookingByLink(paymentLinkId)) ? "already" : "unknown";
  }

  const ev = immersions.find((x) => x.slug === booking.immersionSlug);
  if (!ev) return "recorded";

  const paid = await paidSeats(ev.slug).catch(() => 0);
  const overBy = ev.seats === null ? 0 : Math.max(0, paid - ev.seats);
  const firstName = booking.fullName.split(/\s+/)[0] ?? booking.fullName;
  const amount = booking.amountInr;

  const sends = await Promise.allSettled([
    amount === null
      ? Promise.resolve()
      : sendImmersionPaidConfirmation({
          to: booking.email,
          firstName,
          ev,
          seats: booking.seats,
          amount,
        }),
    sendImmersionPaidNotification({
      id: booking.id,
      fullName: booking.fullName,
      email: booking.email,
      seats: booking.seats,
      amount,
      paymentId,
      ev,
      overBy,
    }),
  ]);
  for (const s of sends) {
    if (s.status === "rejected") {
      console.error("[payment] email send failed", s.reason);
    }
  }
  return "recorded";
}
