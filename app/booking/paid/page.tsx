import type { Metadata } from "next";

import { ContactEmail } from "@/components/ContactEmail";
import { LegalLayout } from "@/components/LegalLayout";
import { TrackOnce } from "@/components/meta/MetaPixel";
import { findBookingByLink } from "@/db/queries";
import {
  formatInr,
  formatWhen,
  immersions,
  numberWord,
  plain,
} from "@/lib/immersions";
import { recordPayment } from "@/lib/payments";
import { verifyReturnSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false, follow: false },
};

type Search = Promise<Record<string, string | string[] | undefined>>;

/**
 * Where Razorpay sends her after paying. The query string carries the link,
 * the payment and a signature made with the key secret; only a signature that
 * checks out lets this page say "confirmed". It also records the payment, in
 * case she arrives before Razorpay's webhook does. Recording twice is harmless.
 */
export default async function BookingPaidPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const q = await searchParams;
  const one = (key: string) => {
    const v = q[key];
    return typeof v === "string" ? v : "";
  };

  const linkId = one("razorpay_payment_link_id");
  const paymentId = one("razorpay_payment_id");
  const status = one("razorpay_payment_link_status");
  const verified =
    linkId !== "" &&
    paymentId !== "" &&
    verifyReturnSignature({
      paymentLinkId: linkId,
      referenceId: one("razorpay_payment_link_reference_id"),
      status,
      paymentId,
      signature: one("razorpay_signature"),
    });
  const paid = verified && status === "paid";

  let booking = null;
  if (paid) {
    try {
      await recordPayment(linkId, paymentId);
      booking = await findBookingByLink(linkId);
    } catch (error) {
      // The webhook will record it; the page can still say what Razorpay said.
      console.error("[paid] could not record on return", error);
    }
  }
  const ev = booking
    ? immersions.find((x) => x.slug === booking.immersionSlug)
    : undefined;

  if (paid) {
    return (
      <LegalLayout eyebrow="Immersion" title="Your place is confirmed.">
        {booking && ev ? (
          <TrackOnce
            event="Purchase"
            eventId={`purchase-${booking.id}`}
            params={{
              content_name: ev.title,
              content_category: "immersion",
              value: booking.amountInr ?? 0,
              currency: "INR",
              num_items: booking.seats,
            }}
          />
        ) : null}
        <div className="flex flex-col gap-5">
          <p className="t-body">
            Your payment has arrived.
            {booking && ev ? (
              <>
                {" "}
                {booking.seats === 1
                  ? "One seat"
                  : `${numberWord(booking.seats)} seats`}
                {booking.amountInr ? `, ${formatInr(booking.amountInr)},` : ""}{" "}
                at {ev.title}: {plain(formatWhen(ev, { range: true }))}, at{" "}
                {ev.venue}.
              </>
            ) : null}
          </p>
          <p className="t-body">
            Razorpay is sending your receipt by email. If anything needs to
            change, write to <ContactEmail />.
          </p>
        </div>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout eyebrow="Immersion" title="Not confirmed yet.">
      <div className="flex flex-col gap-5">
        <p className="t-body">
          This page could not confirm a payment. If money has left your account,
          it will still reach us, and you will hear from us once it does.
        </p>
        <p className="t-body">
          If you did not finish paying, the link in your email stays open until
          the time it gives. Anything else, write to <ContactEmail />.
        </p>
      </div>
    </LegalLayout>
  );
}
