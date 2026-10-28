"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ZodType } from "zod";

import { ContactEmail } from "@/components/ContactEmail";
import {
  CheckboxGroupField,
  Honeypot,
  RadioField,
  TextAreaField,
  TextField,
} from "@/components/form/Fields";
import {
  AGE_BANDS,
  CITIES,
  NEXT_STEPS,
  NEXT_STEP_NONE,
  PRACTICES,
  PRACTICES_TODAY,
  SPEND_BANDS,
  WORKOUT_MODES,
} from "@/lib/config";
import {
  APPLICATION_STEPS,
  applicationFieldsSchema,
  validateField,
  wantsContact,
} from "@/lib/schemas";
import { readReferrer, readUtm } from "@/lib/utm";

/** Bumped when the shape of the form changes, so an old draft cannot half-fill it. */
const STORAGE_KEY = "questionnaire-draft-v2";

type Values = {
  age_band: string;
  city: string;
  interests: string[];
  practices_today: string[];
  workout_mode: string;
  recent_attempts: string;
  what_interrupts: string;
  spend_band: string;
  year_from_now: string;
  next_steps: string[];
  email: string;
};

const EMPTY: Values = {
  age_band: "",
  city: "",
  interests: [],
  practices_today: [],
  workout_mode: "",
  recent_attempts: "",
  what_interrupts: "",
  spend_band: "",
  year_from_now: "",
  next_steps: [],
  email: "",
};

const SHAPE = applicationFieldsSchema.shape as unknown as Record<
  string,
  ZodType
>;
const CONTACT_FIELDS = new Set(["email"]);

/** An empty optional field is absent, not an empty string. */
function normalise(name: string, value: Values[keyof Values]) {
  if (CONTACT_FIELDS.has(name) && value === "") return undefined;
  return value;
}

type Status = "idle" | "submitting" | "error";

export function Questionnaire() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [done, setDone] = useState<null | {
    duplicate: boolean;
    contactWanted: boolean;
  }>(null);

  const openedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMoved = useRef(false);

  useEffect(() => {
    openedAt.current = Date.now();
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved)
        setValues({ ...EMPTY, ...(JSON.parse(saved) as Partial<Values>) });
    } catch {
      // A browser that refuses storage simply starts her with an empty form.
    }
  }, []);

  // Step changes move focus to the new heading; the live region says where she is.
  useEffect(() => {
    if (!hasMoved.current) return;
    headingRef.current?.focus();
  }, [step]);

  const current = APPLICATION_STEPS[step]!;
  const contactWanted = wantsContact(values.next_steps);

  function set<K extends keyof Values>(name: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name as string]) return prev;
      const next = { ...prev };
      delete next[name as string];
      return next;
    });
  }

  function errorFor(name: string): string | undefined {
    if (CONTACT_FIELDS.has(name) && !contactWanted) return undefined;
    const value = normalise(name, values[name as keyof Values]);
    if (CONTACT_FIELDS.has(name) && value === undefined) {
      return "Please give us an email address.";
    }
    return validateField(SHAPE, name, value);
  }

  function errorsForStep(index: number): Record<string, string> {
    const found: Record<string, string> = {};
    for (const name of APPLICATION_STEPS[index]!.fields as readonly string[]) {
      const message = errorFor(name);
      if (message) found[name] = message;
    }
    return found;
  }

  function blurValidate(name: keyof Values) {
    const message = errorFor(name as string);
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
    const stepErrors = errorsForStep(step);
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

    const allErrors: Record<string, string> = {};
    APPLICATION_STEPS.forEach((_, i) =>
      Object.assign(allErrors, errorsForStep(i)),
    );
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
          email: values.email.trim() || undefined,
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

      const body = (await response.json()) as {
        ok?: boolean;
        duplicate?: boolean;
        contactWanted?: boolean;
      };
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
      setDone({
        duplicate: Boolean(body.duplicate),
        contactWanted: Boolean(body.contactWanted),
      });
    } catch {
      setStatus("error");
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-6">
        <hr className="rule-brass" />
        <h3 className="t-h2">Thank you. It is with us.</h3>
        {done.contactWanted ? (
          <>
            <p className="t-body">
              {done.duplicate
                ? "Your answers were already in, so we have updated them rather than adding a second set. Nothing more is needed from you."
                : "A short confirmation is on its way to your inbox."}{" "}
              Answers are read in the order they arrive, and you will hear back
              from us within a week — either way, and from a person.
            </p>
            <p className="t-body text-fg-muted">
              If anything changes in the meantime, write to <ContactEmail />.
            </p>
          </>
        ) : (
          <p className="t-body">
            You asked for nothing back, so nothing will be sent. Your answers go
            into what we are learning about how women manage their health, and
            that is genuinely useful. Thank you for the time.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative flex flex-col gap-10"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2" aria-hidden="true">
          {APPLICATION_STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`h-px flex-1 ${i <= step ? "bg-brass" : "bg-rule"}`}
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
          <RadioField
            name="age_band"
            legend="Which age band are you in?"
            value={values.age_band}
            options={AGE_BANDS.map((b) => ({ value: b, label: b }))}
            onChange={(v) => set("age_band", v)}
            error={errors.age_band}
          />
          <RadioField
            name="city"
            legend="Which city are you in?"
            value={values.city}
            options={CITIES.map((c) => ({ value: c, label: c }))}
            onChange={(v) => set("city", v)}
            error={errors.city}
          />
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-10">
          <CheckboxGroupField
            name="interests"
            legend="What interests you?"
            helper="Whether or not you currently do it. Select all that apply."
            columns
            values={values.interests}
            options={PRACTICES}
            onChange={(v) => set("interests", v)}
            error={errors.interests}
          />
          <CheckboxGroupField
            name="practices_today"
            legend="And what do you actually do today?"
            helper="The same list. Only what is genuinely part of your week right now."
            columns
            values={values.practices_today}
            options={PRACTICES_TODAY}
            onChange={(v) => set("practices_today", v)}
            error={errors.practices_today}
          />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-9">
          <RadioField
            name="workout_mode"
            legend="How do you mostly work out?"
            value={values.workout_mode}
            options={WORKOUT_MODES.map((w) => ({ value: w, label: w }))}
            onChange={(v) => set("workout_mode", v)}
            error={errors.workout_mode}
          />
          <TextAreaField
            id="recent_attempts"
            label="Over the last two years, what have you tried in order to feel better or stay well?"
            helper="Anything counts — a trainer, a class, an app, a retreat, a resolution that lasted a week. Including nothing."
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
            helper="Be as specific as you like. Travel, family, boredom, timing, the trainer, results that did not show — whatever it actually was."
            required
            rows={4}
            value={values.what_interrupts}
            onChange={(v) => set("what_interrupts", v)}
            onBlur={() => blurValidate("what_interrupts")}
            error={errors.what_interrupts}
          />
          <RadioField
            name="spend_band"
            legend="Roughly what have you spent on your health in the last twelve months?"
            helper="Trainers, classes, doctors, supplements, retreats — anything."
            value={values.spend_band}
            options={SPEND_BANDS.map((b) => ({ value: b, label: b }))}
            onChange={(v) => set("spend_band", v)}
            error={errors.spend_band}
          />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-10">
          {/* No helper line here on purpose. Whether she answers in terms of her
              body, her energy, her family or herself is itself the finding. */}
          <TextAreaField
            id="year_from_now"
            label="What would you want to be true about yourself a year from now?"
            required
            rows={4}
            value={values.year_from_now}
            onChange={(v) => set("year_from_now", v)}
            onBlur={() => blurValidate("year_from_now")}
            error={errors.year_from_now}
          />

          <CheckboxGroupField
            name="next_steps"
            legend="What would you like to happen next?"
            helper="Select all that apply."
            values={values.next_steps}
            options={NEXT_STEPS}
            exclusive={NEXT_STEP_NONE}
            onChange={(v) => set("next_steps", v)}
            error={errors.next_steps}
          />

          {contactWanted ? (
            <div className="flex flex-col gap-9 border-l border-brass pl-5">
              <p className="t-meta text-fg-muted">
                So that we can come back to you about that.
              </p>
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
              <p className="t-meta text-fg-muted">
                Sending this means we may write to you about what you ticked.
                The{" "}
                <a href="/privacy" className="link">
                  privacy note
                </a>{" "}
                says what is kept and how to have it deleted.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <Honeypot value={honeypot} onChange={setHoneypot} />

      {status === "error" ? (
        <div className="border-l border-brass-text pl-5">
          <p className="t-meta">
            Something went wrong on our side and your answers were not saved.
            Nothing you wrote has been lost — try the button again, or send them
            to <ContactEmail subject="Questionnaire" /> and we will enter them
            ourselves.
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
          step — and the form would submit itself on the way into the last step.
        */}
        {step < APPLICATION_STEPS.length - 1 ? (
          <button
            key="continue"
            type="button"
            className="btn btn-primary"
            onClick={goNext}
          >
            Continue
          </button>
        ) : (
          <button
            key="send"
            type="submit"
            className="btn btn-primary"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send"}
          </button>
        )}
      </div>
    </form>
  );
}
