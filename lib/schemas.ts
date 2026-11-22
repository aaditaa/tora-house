import { z } from "zod";

import { CITIES } from "@/lib/config";

/**
 * The schemas for the two forms on the site: the waitlist and the immersion booking.
 * Each is used by the browser for per-field validation and by its API route for the
 * authoritative check. The client never decides what is valid.
 *
 * Note what is NOT here, and must never be added: weight, height, measurements,
 * clothing size, medical conditions, diagnoses, medications, symptoms, menopause
 * status or mental-health history. That is sensitive personal data under India's
 * DPDP Act and belongs in a private consultation, not in a marketing database.
 */

const email = z
  .string()
  .trim()
  .pipe(z.email("That does not look like an email address."))
  .transform((v) => v.toLowerCase());

const shortText = (message: string, max = 160) =>
  z
    .string()
    .trim()
    .min(2, message)
    .max(max, "That is longer than this field allows.");

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
    "That does not look like a phone number. An Indian mobile, or a number with its country code.",
  )
  .transform((v) => {
    const indian = INDIAN_MOBILE.exec(v);
    return indian ? `+91${indian[1]}` : v;
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

/** The three answers, as she reads them. Stored as codes by the route. */
export const MEMBER_STATUS = [
  "Not a member yet",
  "On the waitlist",
  "A member",
] as const;

/** Party size. Capped at four: a small room is the point of the evening. */
export const MAX_SEATS_PER_BOOKING = 4;

const optionalLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "That is longer than this field allows.")
    .optional();

/**
 * Name, email, seats and member status are required. Phone is optional: a number
 * is useful on the morning, but this form asks for both an address and a number
 * only because an event has a day-of, and nobody should be turned away for not
 * giving one.
 */
export const immersionBookingFieldsSchema = z.object({
  full_name: shortText("Please tell us your name.", 120),
  email,
  phone: z.union([z.literal(""), phone]).optional(),
  seats: z.coerce
    .number()
    .int()
    .min(1, "Choose how many seats.")
    .max(
      MAX_SEATS_PER_BOOKING,
      `Up to ${MAX_SEATS_PER_BOOKING} seats per booking.`,
    ),
  member_status: z.enum(MEMBER_STATUS, { message: "Please choose one." }),
  dietary: optionalLine(200),
  heard: optionalLine(200),
});

export const immersionBookingPayloadSchema = immersionBookingFieldsSchema
  .extend(metaSchema.shape)
  .extend({ immersion_slug: z.string().min(1).max(80) });

export type WaitlistPayload = z.infer<typeof waitlistPayloadSchema>;

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
