import { z } from "zod";

import {
  AGE_BANDS,
  CITIES,
  PRACTICES,
  PRACTICES_TODAY,
  SPEND_BANDS,
  WORKOUT_MODES,
} from "@/lib/config";

/**
 * One schema, used by the browser for per-field and per-step validation and by the
 * API route for the authoritative check. The client never decides what is valid.
 *
 * The last step asks for an email address, a phone number and one checkbox. The
 * address is required and is what the row is keyed on; the number is optional and is
 * a second way to reach her rather than a second requirement.
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

const chooseOne = (message: string) => ({ message });

/**
 * Indian mobiles by default, any country code accepted. Punctuation is stripped
 * before the check, because a number pasted from a contact card arrives carrying
 * spaces or brackets and refusing it over those loses an answer at the very last
 * field of a ten-minute form. Indian numbers are normalised to the same +91 form on
 * the way in, so the column does not end up holding four spellings of one number.
 */
const INDIAN_MOBILE = /^(?:\+?91|0)?([6-9]\d{9})$/;
const WITH_COUNTRY_CODE = /^\+\d{8,15}$/;

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()\-.]/g, ""))
  .refine(
    (v) => INDIAN_MOBILE.test(v) || WITH_COUNTRY_CODE.test(v),
    "That does not look like a phone number \u2014 an Indian mobile, or a number with its country code.",
  )
  .transform((v) => {
    const indian = INDIAN_MOBILE.exec(v);
    return indian ? `+91${indian[1]}` : v;
  });

export const applicationFieldsSchema = z.object({
  // 1 and 2
  age_band: z.enum(AGE_BANDS, chooseOne("Please choose one.")),
  city: z.enum(CITIES, chooseOne("Please choose one.")),

  // 3 and 4 — the pair. Same list, so the gap between them is readable directly.
  interests: z
    .array(z.enum(PRACTICES))
    .min(1, "Please choose at least one — or Not sure yet."),
  practices_today: z
    .array(z.enum(PRACTICES_TODAY))
    .min(1, "Please choose at least one — or Nothing regular at the moment."),

  // 5
  workout_mode: z.enum(WORKOUT_MODES, chooseOne("Please choose one.")),

  // 6, 7 — the two that matter most. Never shorten these into options.
  recent_attempts: longAnswer(
    "Even a sentence helps. Anything counts, including nothing.",
  ),
  what_interrupts: longAnswer("Tell us what usually gets in the way."),

  // 8 — what she has spent, never what she would pay.
  spend_band: z.enum(SPEND_BANDS, chooseOne("Please choose one.")),

  // 9 — deliberately without a helper line.
  year_from_now: longAnswer("Tell us what you would want to be true."),

  // 10 — how to reach her. Required: there is no anonymous submission any more.
  email,

  /** Optional on purpose. See the note on the parser above. */
  phone: phone.optional(),

  /**
   * The only thing she is asked to opt in to. Submitting an address is what lets us
   * reply to the questionnaire itself; this box is the separate question of whether
   * she wants to hear more than that reply, and it starts unticked.
   */
  hear_more: z.boolean(),
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

/**
 * The server's authoritative check. Nothing is conditional any more: every field in
 * the object schema is required of every submission, so this is the object schema
 * plus the metadata captured alongside it.
 */
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

/** One question group per step. Used for step validation and the progress rule. */
export const APPLICATION_STEPS = [
  {
    title: "About you",
    fields: ["age_band", "city"],
  },
  {
    // Three and four belong together: she answers four by recognising the list
    // she has just read, which is what makes it take two seconds.
    title: "What draws you",
    fields: ["interests", "practices_today"],
  },
  {
    title: "How it goes now",
    fields: [
      "workout_mode",
      "recent_attempts",
      "what_interrupts",
      "spend_band",
    ],
  },
  {
    title: "What next",
    fields: ["year_from_now", "email", "phone", "hear_more"],
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
