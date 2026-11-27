"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { ZodType } from "zod";

import { Honeypot, TextField } from "@/components/form/Fields";
import { Modal } from "@/components/Modal";
import {
  BOOKED_KEY,
  BOOKING_STARTED_EVENT,
  BOOKING_STARTED_KEY,
} from "@/lib/dismiss";
import { formatInr } from "@/lib/immersions";
import { newEventId, track, type MetaEvent } from "@/lib/meta";
import {
  immersionBookingFieldsSchema,
  validateField,
  validateFields,
} from "@/lib/schemas";
import { readReferrer, readUtm } from "@/lib/utm";

const SHAPE = immersionBookingFieldsSchema.shape as unknown as Record<
  string,
  ZodType
>;
const FIELDS = ["full_name", "email"] as const;

type Status =
  | "idle"
  | "submitting"
  | "paying"
  | "error"
  | "full"
  | "closed"
  | "linkLater"
  | "alreadyPaid";

/**
 * The landing page's booking, as short as it can be: a name and an email, then
 * straight to the Razorpay page made for this booking. Every Reserve button on
 * the page opens it ([data-reserve="1"] or "2"), and so does a link ending in
 * #reserve-1 or #reserve-2, so an ad can land on an open card.
 *
 * It books through the same API as the home page form, so the seat hold, the
 * per-booking payment link, the paid webhook and the emails are all the same.
 * The Meta events run in the same order as on the home page: InitiateCheckout
 * when the card opens, AddPaymentInfo (paired with the server's) when the
 * booking is in, Purchase on the page Razorpay returns her to.
 *
 * It also sends Contact and FindLocation for links marked [data-track].
 */
export function QuickReserve({
  slug,
  title,
  prices,
  summary,
}: {
  slug: string;
  title: string;
  /** The total for one seat, two seats. */
  prices: readonly number[];
  /** "Saturday 5 December, 10–11am · Maison de Medusa, Whitefield" */
  summary: string;
}) {
  const [seats, setSeats] = useState<number | null>(null);
  const [values, setValues] = useState({ full_name: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  // Time on the page, not time in the card: autofill can complete two fields in
  // under the bot threshold, and a person who has read the page is not a bot.
  const pageOpenedAt = useRef(0);

  const openFor = useCallback(
    (n: number) => {
      const price = prices[n - 1];
      if (price === undefined) return;
      setSeats(n);
      setStatus("idle");
      setErrors({});
      // Nobody is interrupted halfway through booking: the home page's
      // invitation stays off for the rest of the visit.
      try {
        window.sessionStorage.setItem(BOOKING_STARTED_KEY, "1");
      } catch {
        /* Private mode: the event below still stops it on this page. */
      }
      window.dispatchEvent(new Event(BOOKING_STARTED_EVENT));
      track("InitiateCheckout", {
        content_name: title,
        content_category: "immersion",
        value: price,
        currency: "INR",
        num_items: n,
      });
    },
    [prices, title],
  );

  useEffect(() => {
    pageOpenedAt.current = Date.now();

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const reserve = target?.closest<HTMLElement>("[data-reserve]");
      if (reserve) {
        e.preventDefault();
        openFor(Number(reserve.dataset.reserve));
        return;
      }
      const tracked = target?.closest<HTMLElement>("[data-track]");
      if (tracked?.dataset.track) {
        track(tracked.dataset.track as MetaEvent);
      }
    };
    const fromHash = () => {
      const m = /^#reserve-(\d)$/.exec(window.location.hash);
      if (m) openFor(Number(m[1]));
    };

    fromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [openFor]);

  const close = useCallback(() => {
    setSeats(null);
    if (window.location.hash.startsWith("#reserve-")) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  function set(name: "full_name" | "email", value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((p) => {
      if (!p[name]) return p;
      const next = { ...p };
      delete next[name];
      return next;
    });
  }

  function blur(name: "full_name" | "email") {
    const message = validateField(SHAPE, name, values[name]);
    setErrors((p) => {
      const next = { ...p };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (seats === null) return;
    const found = validateFields(SHAPE, FIELDS, values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("submitting");
    const metaEventId = newEventId("payinfo");
    try {
      const response = await fetch("/api/immersion-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.full_name,
          email: values.email,
          seats,
          immersion_slug: slug,
          source: "landing",
          website: honeypot,
          form_opened_at: pageOpenedAt.current,
          utm: readUtm(),
          referrer: readReferrer(),
          meta_event_id: metaEventId,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        amount?: number;
        payUrl?: string | null;
        alreadyPaid?: boolean;
      };

      if (response.status === 409) {
        setStatus(body.error === "closed" ? "closed" : "full");
        return;
      }
      if (!response.ok || !body.ok) {
        setStatus("error");
        return;
      }
      try {
        window.sessionStorage.setItem(BOOKED_KEY, "1");
      } catch {
        /* Private mode: nothing on this page depends on it. */
      }
      if (body.alreadyPaid) {
        setStatus("alreadyPaid");
        return;
      }

      track(
        "AddPaymentInfo",
        {
          content_name: title,
          content_category: "immersion",
          value: body.amount ?? prices[seats - 1] ?? 0,
          currency: "INR",
          num_items: seats,
        },
        metaEventId,
      );

      if (body.payUrl) {
        setStatus("paying");
        // A moment for the pixel's request to leave before the page does.
        const url = body.payUrl;
        window.setTimeout(() => window.location.assign(url), 350);
        return;
      }
      setStatus("linkLater");
    } catch {
      setStatus("error");
    }
  }

  const price = seats === null ? undefined : prices[seats - 1];
  const priceText = price === undefined ? "" : formatInr(price);
  const busy = status === "submitting" || status === "paying";

  return (
    <Modal
      open={seats !== null}
      onClose={close}
      labelledBy="reserve-heading"
      initialFocus="qr_full_name"
    >
      <h2 id="reserve-heading" className="t-h3">
        {seats === 2 ? "Reserve two seats." : "Reserve a seat."}
      </h2>
      <p className="t-meta text-fg-muted">
        {summary} &middot; {priceText}
        {seats === 2 ? " for two" : ""}
      </p>

      {status === "full" || status === "closed" ? (
        <div className="flex flex-col gap-4">
          <p className="t-body">
            {status === "full"
              ? "The last seats went while you were here. The waitlist hears about the next one first."
              : "Bookings for this one have closed."}
          </p>
          <div>
            <Link href="/#waitlist" className="btn btn-brass">
              Join the waitlist
            </Link>
          </div>
        </div>
      ) : status === "alreadyPaid" ? (
        <p className="t-body">
          You have already paid for this one, so your place is confirmed. To
          change anything, reply to your confirmation email.
        </p>
      ) : status === "linkLater" ? (
        <p className="t-body" role="status">
          Your request is in. The link to pay {priceText} follows by email, to{" "}
          <span className="break-words">{values.email}</span>.
        </p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          <TextField
            id="qr_full_name"
            label="Your name"
            required
            autoComplete="name"
            value={values.full_name}
            onChange={(v) => set("full_name", v)}
            onBlur={() => blur("full_name")}
            error={errors.full_name}
          />
          <TextField
            id="qr_email"
            label="Email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(v) => set("email", v)}
            onBlur={() => blur("email")}
            error={errors.email}
          />
          <Honeypot value={honeypot} onChange={setHoneypot} />

          {status === "error" ? (
            <p className="t-meta field-error-text" role="alert">
              That did not go through. Try once more, or message us.
            </p>
          ) : null}

          <div>
            <button type="submit" className="btn btn-brass" disabled={busy}>
              {status === "paying"
                ? "Opening Razorpay…"
                : status === "submitting"
                  ? "One moment…"
                  : `Continue to payment · ${priceText}`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
