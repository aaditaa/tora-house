"use client";

import Link from "next/link";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ZodType } from "zod";

import { CheckboxField, Honeypot, SelectField, TextField } from "@/components/form/Fields";
import { CITIES, CONTACT_EMAIL } from "@/lib/config";
import { validateField, validateFields, waitlistFieldsSchema } from "@/lib/schemas";
import { readReferrer, readUtm } from "@/lib/utm";

type Values = {
  full_name: string;
  email: string;
  city: string;
  note: string;
  consent_contact: boolean;
};

const EMPTY: Values = {
  full_name: "",
  email: "",
  city: "",
  note: "",
  consent_contact: false,
};

const SHAPE = waitlistFieldsSchema.shape as unknown as Record<string, ZodType>;
const FIELDS = ["full_name", "email", "city", "note", "consent_contact"] as const;

/**
 * Deliberately quieter than the application: no steps, no progress rule, one line of
 * fields on desktop. Every field added here costs conversions, and this is a
 * low-intent moment.
 */
export function Waitlist({ source }: { source: string }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [done, setDone] = useState(false);
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function set<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name as string]) return prev;
      const next = { ...prev };
      delete next[name as string];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateFields(SHAPE, FIELDS, values as Record<string, unknown>);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source,
          website: honeypot,
          form_opened_at: openedAt.current,
          utm: readUtm(),
          referrer: readReferrer(),
        }),
      });
      const body = response.ok ? ((await response.json()) as { ok?: boolean }) : { ok: false };
      if (!body.ok) {
        setStatus("error");
        return;
      }
      setStatus("idle");
      setDone(true);
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <p className="t-body">
        You are on the list. We will write when the next cohort or the next city chapter opens, and
        not otherwise.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-7">
      <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-4">
        <TextField
          id="wl_full_name"
          label="Full name"
          required
          autoComplete="name"
          value={values.full_name}
          onChange={(v) => set("full_name", v)}
          onBlur={() => setErrors((p) => ({ ...p, ...pick("full_name", values) }))}
          error={errors.full_name}
        />
        <TextField
          id="wl_email"
          label="Email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(v) => set("email", v)}
          onBlur={() => setErrors((p) => ({ ...p, ...pick("email", values) }))}
          error={errors.email}
        />
        <SelectField
          id="wl_city"
          label="City"
          required
          options={CITIES}
          value={values.city}
          onChange={(v) => set("city", v)}
          error={errors.city}
        />
        <TextField
          id="wl_note"
          label="A line, if you want to add one"
          value={values.note}
          onChange={(v) => set("note", v)}
          error={errors.note}
        />
      </div>

      <CheckboxField
        id="wl_consent_contact"
        checked={values.consent_contact}
        onChange={(v) => set("consent_contact", v)}
        error={errors.consent_contact}
        label={
          <>
            Write to me when the next cohort or the next city chapter opens. The{" "}
            <Link href="/privacy" className="link">
              privacy note
            </Link>{" "}
            says what is kept and how to come off the list.
          </>
        }
      />

      <Honeypot value={honeypot} onChange={setHoneypot} />

      {status === "error" ? (
        <p className="t-meta">
          Something went wrong on our side. Try again, or write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : null}

      <div>
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Adding…" : "Join the waitlist"}
        </button>
      </div>
    </form>
  );
}

function pick(name: string, values: Record<string, unknown>) {
  const message = validateField(SHAPE, name, values[name]);
  return message ? { [name]: message } : {};
}
