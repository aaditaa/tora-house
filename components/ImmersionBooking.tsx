"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ZodType } from "zod";

import { Honeypot, SelectField, TextField } from "@/components/form/Fields";
import { ContactEmail } from "@/components/ContactEmail";
import { BOOKED_KEY } from "@/lib/dismiss";
import {
  MEMBER_STATUS,
  immersionBookingFieldsSchema,
  validateField,
  validateFields,
} from "@/lib/schemas";
import { readReferrer, readUtm } from "@/lib/utm";

type Values = {
  full_name: string;
  email: string;
  phone: string;
  seats: string;
  member_status: string;
  dietary: string;
  heard: string;
};

const EMPTY: Values = {
  full_name: "",
  email: "",
  phone: "",
  seats: "1",
  member_status: "",
  dietary: "",
  heard: "",
};

const SHAPE = immersionBookingFieldsSchema.shape as unknown as Record<
  string,
  ZodType
>;
const FIELDS = Object.keys(EMPTY) as (keyof Values)[];

/**
 * The booking, closed under its button until asked for. It opens on the button
 * and on #reserve, so the Reserve links elsewhere on the page arrive at an open
 * form rather than a closed one.
 *
 * No card fields and no checkout. Payment is a Razorpay hosted link, sent after
 * the request or linked from the confirmation; it never happens on this site.
 */
export function ImmersionBooking({
  slug,
  reserveLabel,
  maxSeats,
  paymentUrl,
}: {
  slug: string;
  reserveLabel: string;
  maxSeats: number;
  paymentUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error" | "full"
  >("idle");
  const [done, setDone] = useState<string | null>(null);
  const openedAt = useRef(0);
  const firstField = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openedAt.current = Date.now();
    const fromHash = () => {
      if (window.location.hash === "#reserve") setOpen(true);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Focus moves into the form when it opens, so a keyboard user is not left on a
  // button that has just disappeared.
  useEffect(() => {
    if (open) firstField.current?.querySelector("input")?.focus();
  }, [open]);

  function set<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function blur(name: keyof Values) {
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
    const found = validateFields(
      SHAPE,
      FIELDS,
      values as Record<string, unknown>,
    );
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/immersion-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          immersion_slug: slug,
          source: "immersion",
          website: honeypot,
          form_opened_at: openedAt.current,
          utm: readUtm(),
          referrer: readReferrer(),
        }),
      });
      if (response.status === 409) {
        setStatus("full");
        return;
      }
      const body = response.ok
        ? ((await response.json()) as { ok?: boolean })
        : { ok: false };
      if (!body.ok) {
        setStatus("error");
        return;
      }
      try {
        window.sessionStorage.setItem(BOOKED_KEY, "1");
      } catch {
        /* Private mode. The worst case is one invitation she does not need. */
      }
      setStatus("idle");
      setDone(values.email.trim());
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <div id="reserve" className="anchor flex flex-col gap-3" role="status">
        <p className="t-h3">Your request is in.</p>
        <p className="t-body">
          A confirmation is on its way to {done}. Your seat is held once it is
          paid
          {paymentUrl ? (
            <>
              {": "}
              <a
                href={paymentUrl}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                pay on Razorpay&rsquo;s page&nbsp;&#8599;
              </a>
              .
            </>
          ) : (
            <>, and the link to pay follows by email.</>
          )}
        </p>
      </div>
    );
  }

  const seatOptions = Array.from({ length: Math.max(1, maxSeats) }, (_, i) =>
    String(i + 1),
  );

  return (
    <div id="reserve" className="anchor flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {open ? null : (
          <button
            type="button"
            className="btn btn-brass"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="immersion-booking-form"
          >
            {reserveLabel}
          </button>
        )}
        <a href="#waitlist" className="t-meta link">
          Or join the waitlist for the year&nbsp;&rarr;
        </a>
      </div>

      {open ? (
        <form
          id="immersion-booking-form"
          noValidate
          onSubmit={onSubmit}
          className="booking-in flex flex-col gap-7"
          aria-label="Reserve a seat"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
            <div ref={firstField}>
              <TextField
                id="ib_full_name"
                label="Full name"
                required
                autoComplete="name"
                value={values.full_name}
                onChange={(v) => set("full_name", v)}
                onBlur={() => blur("full_name")}
                error={errors.full_name}
              />
            </div>
            <TextField
              id="ib_email"
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
            <TextField
              id="ib_phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              helper="Optional. Only for the morning, if you are running late."
              value={values.phone}
              onChange={(v) => set("phone", v)}
              onBlur={() => blur("phone")}
              error={errors.phone}
            />
            <SelectField
              id="ib_seats"
              label="Seats"
              required
              options={seatOptions}
              value={values.seats}
              onChange={(v) => set("seats", v)}
              error={errors.seats}
            />
            <SelectField
              id="ib_member_status"
              label="Are you a member?"
              required
              options={MEMBER_STATUS}
              value={values.member_status}
              onChange={(v) => set("member_status", v)}
              error={errors.member_status}
            />
            <TextField
              id="ib_dietary"
              label="Anything we should know about food?"
              value={values.dietary}
              onChange={(v) => set("dietary", v)}
              onBlur={() => blur("dietary")}
              error={errors.dietary}
            />
            <TextField
              id="ib_heard"
              label="How did you hear about this?"
              value={values.heard}
              onChange={(v) => set("heard", v)}
              onBlur={() => blur("heard")}
              error={errors.heard}
            />
          </div>

          <Honeypot value={honeypot} onChange={setHoneypot} />

          {status === "error" ? (
            <p className="t-meta" role="alert">
              Something went wrong on our side. Try again, or write to{" "}
              <ContactEmail />.
            </p>
          ) : null}
          {status === "full" ? (
            <p className="t-meta" role="alert">
              The last seat went while you were filling this in. The waitlist is
              the way to hear about the next one.
            </p>
          ) : null}

          <div>
            <button
              type="submit"
              className="btn btn-brass"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : reserveLabel}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
