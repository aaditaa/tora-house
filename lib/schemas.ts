import { z } from "zod";

import {
  AGE_BANDS,
  CITIES,
  OCCUPATIONS,
  OFFLINE_AVAILABILITY,
  SPEND_BANDS,
} from "@/lib/config";

/**
 * One schema, used by the browser for per-field and per-step validation and by the
 * API route for the authoritative check. The client never decides what is valid.
 *
 * Note what is NOT here, and must never be added: weight, height, measurements,
 * clothing size, diet, medical conditions, diagnoses, medications, symptoms,
 * menopause status, mental-health history, income or net worth. The first group is
 * sensitive personal data under India's DPDP Act and belongs in a private
 * consultation after acceptance, not in a marketing database. The last produces
 * inflated fiction; spend_band is the honest version of that question.
 */

const email = z
  .string()
  .trim()
  .pipe(z.email("That does not look like an email address."))
  .transform((v) => v.toLowerCase());

const longAnswer = (message: string) =>
  z
    .string()
    .trim()
    .min(2, message)
    .max(4000, "That is longer than we can store — please trim it.");

const shortText = (message: string, max = 160) =>
  z
    .string()
    .trim()
    .min(2, message)
    .max(max, "That is longer than this field allows.");

export const applicationFieldsSchema = z.object({
  // Step 1 — About you
  full_name: shortText("Please tell us your name.", 120),
  email,
  phone: z
    .string()
    .trim()
    .min(8, "Please give a number we can reach you on.")
    .max(24, "That number looks too long.")
    .regex(/^[+\d][\d\s\-().]*$/, "Please use digits, spaces and + only."),
  city: z.enum(CITIES, { message: "Please choose a city." }),
  age_band: z.enum(AGE_BANDS, { message: "Please choose one." }),
  occupation: z.enum(OCCUPATIONS, { message: "Please choose one." }),

  // Step 2 — Where you are now
  recent_attempts: longAnswer(
    "Even a sentence helps. Anything counts, including nothing.",
  ),
  what_interrupts: longAnswer("Tell us what usually gets in the way."),
  spend_band: z.enum(SPEND_BANDS, { message: "Please choose one." }),
  year_from_now: longAnswer("Tell us what you would want to be true."),
  trains_competitively: z
    .enum(["yes", "no"], { message: "Please choose one." })
    .transform((v) => v === "yes"),
  referral_source: shortText("Please tell us how you found us.", 200),

  // Step 3 — Fit and consent
  offline_availability: z.enum(OFFLINE_AVAILABILITY, {
    message: "Please choose one.",
  }),
  notes: z
    .string()
    .trim()
    .max(4000, "That is longer than we can store.")
    .optional(),
  consent_contact: z.literal(true, {
    message: "We need this to be able to reply to your application.",
  }),
  research_optin: z.boolean(),
});

/** Captured silently alongside the answers. */
const metaSchema = z.object({
  /** Honeypot. Real applicants never fill this. */
  website: z.string().optional(),
  /** Set on mount. Anything completed in under four seconds is a bot. */
  form_opened_at: z.number().int().nonnegative(),
  utm: z.record(z.string(), z.string()).optional(),
  referrer: z.string().max(2000).optional(),
});

export const applicationPayloadSchema = applicationFieldsSchema.extend(
  metaSchema.shape,
);

export const waitlistFieldsSchema = z.object({
  full_name: shortText("Please tell us your name.", 120),
  email,
  city: z.enum(CITIES, { message: "Please choose a city." }),
  note: z
    .string()
    .trim()
    .max(500, "Please keep this to a line or two.")
    .optional(),
  consent_contact: z.literal(true, {
    message: "We need this to be able to write to you.",
  }),
});

export const waitlistPayloadSchema = waitlistFieldsSchema.extend(
  metaSchema.shape,
);

export type ApplicationFields = z.infer<typeof applicationFieldsSchema>;
export type ApplicationPayload = z.infer<typeof applicationPayloadSchema>;
export type WaitlistPayload = z.infer<typeof waitlistPayloadSchema>;

/** One question group per step. Used for step validation and for the progress rule. */
export const APPLICATION_STEPS = [
  {
    title: "About you",
    fields: ["full_name", "email", "phone", "city", "age_band", "occupation"],
  },
  {
    title: "Where you are now",
    fields: [
      "recent_attempts",
      "what_interrupts",
      "spend_band",
      "year_from_now",
      "trains_competitively",
      "referral_source",
    ],
  },
  {
    title: "Fit and consent",
    fields: [
      "offline_availability",
      "notes",
      "consent_contact",
      "research_optin",
    ],
  },
] as const;

export type ApplicationFieldName = keyof typeof applicationFieldsSchema.shape;

/** Validate one field in isolation, for validation on blur. */
export function validateField(
  shape: Record<string, z.ZodType>,
  name: string,
  value: unknown,
): string | undefined {
  const field = shape[name];
  if (!field) return undefined;
  const result = field.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

/** Validate the fields belonging to one step. */
export function validateFields(
  shape: Record<string, z.ZodType>,
  names: readonly string[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const name of names) {
    const message = validateField(shape, name, values[name]);
    if (message) errors[name] = message;
  }
  return errors;
}

/** The minimum a human takes to fill the form, in ms. */
export const MIN_FILL_MS = 4000;
