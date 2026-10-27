"use client";

import Link from "next/link";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ZodType } from "zod";

import {
  CheckboxField,
  Honeypot,
  RadioField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form/Fields";
import {
  AGE_BANDS,
  CITIES,
  CITY,
  CONTACT_EMAIL,
  OCCUPATIONS,
  OFFLINE_AVAILABILITY,
  SPEND_BANDS,
} from "@/lib/config";
import { APPLICATION_STEPS, applicationFieldsSchema, validateField, validateFields } from "@/lib/schemas";
import { readReferrer, readUtm } from "@/lib/utm";

const STORAGE_KEY = "application-draft-v1";

type Values = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  age_band: string;
  occupation: string;
  recent_attempts: string;
  what_interrupts: string;
  spend_band: string;
  year_from_now: string;
  trains_competitively: string;
  referral_source: string;
  offline_availability: string;
  notes: string;
  consent_contact: boolean;
  research_optin: boolean;
};

const EMPTY: Values = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  age_band: "",
  occupation: "",
  recent_attempts: "",
  what_interrupts: "",
  spend_band: "",
  year_from_now: "",
  trains_competitively: "",
  referral_source: "",
  offline_availability: "",
  notes: "",
  consent_contact: false,
  research_optin: false,
};

const SHAPE = applicationFieldsSchema.shape as unknown as Record<string, ZodType>;

type Status = "idle" | "submitting" | "error";

export function Application() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [done, setDone] = useState<null | { duplicate: boolean }>(null);

  const openedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    openedAt.current = Date.now();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setValues({ ...EMPTY, ...(JSON.parse(saved) as Partial<Values>) });
    } catch {
      // A browser that refuses storage simply starts her with an empty form.
    }
  }, []);

  // Step changes move focus to the new heading; the live region says where she is.
  useEffect(() => {
    if (!hasMoved.current) return;
    headingRef.current?.focus();
  }, [step]);

  const current = APPLICATION_STEPS[step];

  function set<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name as string]) return prev;
      const next = { ...prev };
      delete next[name as string];
      return next;
    });
  }

  function blurValidate(name: keyof Values) {
    const message = validateField(SHAPE, name as string, values[name]);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name as string] = message;
      else delete next[name as string];
      return next;
    });
  }

  function persist(next: Values) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Not being able to save a draft is not worth interrupting her for.
    }
  }

  function goNext() {
    const stepErrors = validateFields(SHAPE, current.fields, values as Record<string, unknown>);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    persist(values);
    hasMoved.current = true;
    setStep((s) => Math.min(s + 1, APPLICATION_STEPS.length - 1));
  }

  function goBack() {
    hasMoved.current = true;
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Enter inside a field on an earlier step means "continue", not "send".
    if (step < APPLICATION_STEPS.length - 1) {
      goNext();
      return;
    }

    const allFields = APPLICATION_STEPS.flatMap((s) => s.fields as readonly string[]);
    const allErrors = validateFields(SHAPE, allFields, values as Record<string, unknown>);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstStep = APPLICATION_STEPS.findIndex((s) =>
        (s.fields as readonly string[]).some((f) => allErrors[f]),
      );
      if (firstStep >= 0) {
        hasMoved.current = true;
        setStep(firstStep);
      }
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          form_opened_at: openedAt.current,
          utm: readUtm(),
          referrer: readReferrer(),
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const body = (await response.json()) as { ok?: boolean; duplicate?: boolean };
      if (!body.ok) {
        setStatus("error");
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to do; the draft will expire with the tab.
      }
      setStatus("idle");
      setDone({ duplicate: Boolean(body.duplicate) });
    } catch {
      setStatus("error");
    }
  }

  const outsideBrief =
    values.age_band === "Outside this range" || (values.city !== "" && values.city !== CITY);

  if (done) {
    return (
      <div className="flex flex-col gap-6">
        <hr className="rule-gold" />
        <h3 className="t-h2">Thank you. It is with us.</h3>
        <p className="t-body">
          {done.duplicate
            ? "Your details were already in, so we have updated what you sent rather than adding a second application. Nothing more is needed from you."
            : "A short confirmation is on its way to your inbox."}{" "}
          Applications are read in the order they arrive, and you will hear back from us within a
          week — either way, and from a person.
        </p>
        <p className="t-body text-fg-muted">
          If anything changes in the meantime, write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="link">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative flex flex-col gap-10">
      {/* Progress rule */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2" aria-hidden="true">
          {APPLICATION_STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`h-px flex-1 ${i <= step ? "bg-gold" : "bg-rule"}`}
            />
          ))}
        </div>
        <p className="t-eyebrow">
          Step {step + 1} of {APPLICATION_STEPS.length} · {current.title}
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {`Step ${step + 1} of ${APPLICATION_STEPS.length}: ${current.title}`}
      </p>

      <h3 ref={headingRef} tabIndex={-1} className="t-h3">
        {current.title}
      </h3>

      {step === 0 ? (
        <div className="flex flex-col gap-9">
          <TextField
            id="full_name"
            label="Full name"
            required
            autoComplete="name"
            value={values.full_name}
            onChange={(v) => set("full_name", v)}
            onBlur={() => blurValidate("full_name")}
            error={errors.full_name}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(v) => set("email", v)}
            onBlur={() => blurValidate("email")}
            error={errors.email}
          />
          <TextField
            id="phone"
            label="WhatsApp number"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            helper="This is how we will reach you to arrange the call."
            value={values.phone}
            onChange={(v) => set("phone", v)}
            onBlur={() => blurValidate("phone")}
            error={errors.phone}
          />
          <SelectField
            id="city"
            label="City"
            required
            options={CITIES}
            value={values.city}
            onChange={(v) => set("city", v)}
            onBlur={() => blurValidate("city")}
            error={errors.city}
          />
          <RadioField
            name="age_band"
            legend="Age"
            value={values.age_band}
            options={AGE_BANDS.map((b) => ({ value: b, label: b }))}
            onChange={(v) => set("age_band", v)}
            error={errors.age_band}
          />
          <SelectField
            id="occupation"
            label="What takes up your days"
            required
            options={OCCUPATIONS}
            value={values.occupation}
            onChange={(v) => set("occupation", v)}
            onBlur={() => blurValidate("occupation")}
            error={errors.occupation}
          />

          {outsideBrief ? (
            <div className="border-l border-gold pl-5">
              <p className="t-meta text-fg-muted">
                The founding cohort is {CITY}-based and built around women 40 to 60, so a
                conversation with you may be about a later chapter rather than this one. Send the
                application anyway — and if you would rather simply be told when a chapter opens
                near you, <a href="#waitlist" className="link">join the waitlist</a>.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-9">
          <TextAreaField
            id="recent_attempts"
            label="Over the last two years, what have you tried in order to feel better or stay well?"
            helper="Anything counts, including nothing."
            required
            rows={4}
            value={values.recent_attempts}
            onChange={(v) => set("recent_attempts", v)}
            onBlur={() => blurValidate("recent_attempts")}
            error={errors.recent_attempts}
          />
          <TextAreaField
            id="what_interrupts"
            label="When something stops, what usually gets in the way?"
            helper="Be as plain as you like. Nobody here is keeping score."
            required
            rows={4}
            value={values.what_interrupts}
            onChange={(v) => set("what_interrupts", v)}
            onBlur={() => blurValidate("what_interrupts")}
            error={errors.what_interrupts}
          />
          <SelectField
            id="spend_band"
            label="Roughly what have you spent on your health in the last twelve months?"
            helper="Trainers, classes, doctors, retreats, anything. A rough band is fine."
            required
            options={SPEND_BANDS}
            value={values.spend_band}
            onChange={(v) => set("spend_band", v)}
            onBlur={() => blurValidate("spend_band")}
            error={errors.spend_band}
          />
          <TextAreaField
            id="year_from_now"
            label="What would you want to be true about yourself a year from now?"
            helper="There is no right answer to this one."
            required
            rows={4}
            value={values.year_from_now}
            onChange={(v) => set("year_from_now", v)}
            onBlur={() => blurValidate("year_from_now")}
            error={errors.year_from_now}
          />
          <RadioField
            name="trains_competitively"
            legend="Are you currently training for an event or competition?"
            helper="Either answer is fine — it just tells us which room you belong in."
            value={values.trains_competitively}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            onChange={(v) => set("trains_competitively", v)}
            error={errors.trains_competitively}
          />
          <TextField
            id="referral_source"
            label="Who sent you, or how did you find us?"
            required
            value={values.referral_source}
            onChange={(v) => set("referral_source", v)}
            onBlur={() => blurValidate("referral_source")}
            error={errors.referral_source}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-9">
          <RadioField
            name="offline_availability"
            legend={`The ${CITY} chapter meets in person every two weeks. Realistically:`}
            value={values.offline_availability}
            options={OFFLINE_AVAILABILITY.map((o) => ({ value: o, label: o }))}
            onChange={(v) => set("offline_availability", v)}
            error={errors.offline_availability}
          />
          <TextAreaField
            id="notes"
            label="Anything you would want us to know before we speak?"
            helper="Optional."
            rows={3}
            value={values.notes}
            onChange={(v) => set("notes", v)}
            onBlur={() => blurValidate("notes")}
            error={errors.notes}
          />

          <hr className="rule" />

          <CheckboxField
            id="consent_contact"
            checked={values.consent_contact}
            onChange={(v) => set("consent_contact", v)}
            error={errors.consent_contact}
            label={
              <>
                I am happy to be contacted about this application, and for my answers to be stored
                while it is assessed. The{" "}
                <Link href="/privacy" className="link">
                  privacy note
                </Link>{" "}
                says what is kept and for how long.
              </>
            }
          />
          <CheckboxField
            id="research_optin"
            checked={values.research_optin}
            onChange={(v) => set("research_optin", v)}
            label="I am happy to be approached for a twenty-minute conversation about how women manage their health, whether or not this goes further."
          />
        </div>
      ) : null}

      <Honeypot value={honeypot} onChange={setHoneypot} />

      {status === "error" ? (
        <div className="border-l border-clay-deep pl-5">
          <p className="t-meta">
            Something went wrong on our side and your application was not saved. Nothing you wrote
            has been lost — try the button again, or send it to{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Application`} className="link">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will enter it ourselves.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        {step > 0 ? (
          <button type="button" className="btn btn-quiet" onClick={goBack}>
            Back
          </button>
        ) : null}

        {/*
          Distinct keys matter. React flushes a click synchronously, so reusing one
          <button> here would let it change from type="button" to type="submit"
          midway through the browser's own handling of the click that advanced the
          step — and the form would submit itself on the way into step three.
        */}
        {step < APPLICATION_STEPS.length - 1 ? (
          <button key="continue" type="button" className="btn btn-primary" onClick={goNext}>
            Continue
          </button>
        ) : (
          <button
            key="send"
            type="submit"
            className="btn btn-primary"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send application"}
          </button>
        )}
      </div>
    </form>
  );
}
