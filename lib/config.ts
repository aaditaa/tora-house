/**
 * The single source of truth for every fact about the club that the page states.
 *
 * Four values were left unfilled in the build brief and are deliberately rendered
 * as visible {{...}} markers rather than invented. See PLACEHOLDERS.md.
 */

/** The club's name. Appears in the wordmark, <title>, OG tags and emails. */
export const BRAND_NAME = "Tora House";

/** The brand line. Sits under the stacked lockup and on the OG image. */
export const BRAND_TAGLINE = "Longevity, as India knew it first.";

/**
 * {{CLOSE_DATE}} — the real date applications close, as "YYYY-MM-DD".
 * `null` renders the marker and keeps the cohort open.
 * This is the ONLY place the date exists. isCohortOpen() derives from it.
 */
export const COHORT_CLOSE_DATE: string | null = null;

/** The founding city chapter. */
export const CITY = "Bengaluru";

/** Cities offered in the application and waitlist selects, in one place. */
export const CITIES = [
  "Bengaluru",
  "Delhi NCR",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Chandigarh",
  "Other",
] as const;
export type City = (typeof CITIES)[number];

export const AGE_BANDS = [
  "40–45",
  "46–50",
  "51–55",
  "56–60",
  "Outside this range",
] as const;

/**
 * Questions three and four share this list deliberately. The gap between what she is
 * drawn to and what she actually does is the most useful single output of the form,
 * and an identical list makes that a direct comparison rather than a coding exercise.
 * Never reorder one without the other.
 */
export const PRACTICES = [
  "Yoga",
  "Breathwork, pranayama, box breathing",
  "Meditation",
  "Ayurveda, daily and seasonal routine",
  "Ayurvedic treatments such as abhyanga, shirodhara or panchakarma",
  "Strength training",
  "Pilates",
  "Running, cycling or swimming",
  "Walking",
  "Mobility and flexibility work",
  "Sleep and recovery",
  "Biomarker testing and health data",
  "Sadhana or spiritual practice",
  "Not sure yet",
] as const;

/** Question four: the same list, plus the honest bottom option. */
export const PRACTICES_TODAY = [
  ...PRACTICES,
  "Nothing regular at the moment",
] as const;

/**
 * The last option has to be there and has to sound neutral. A good share of this
 * segment will pick it, and they are the ones most worth hearing from — if the only
 * honest answer is an embarrassing one, she closes the tab.
 */
export const WORKOUT_MODES = [
  "With a personal trainer, one-to-one",
  "In a group class or studio",
  "At a gym, on my own",
  "At home, on my own",
  "At home, following an app or video",
  "Outdoors — walks, runs, cycling",
  "With a teacher who comes to me",
  "I don't have a regular workout right now",
] as const;

/**
 * One question carrying consent, the research-call ask and the waitlist. The fourth
 * option is what makes the other three mean anything: without an easy exit, a polite
 * respondent ticks the first box out of courtesy and nothing has been learned.
 */
export const NEXT_STEPS = [
  `I'd like to hear about the founding cohort in ${CITY}`,
  "I'm happy to have a twenty-minute conversation about this",
  "I'd like to be on the waitlist for a later cohort or another city",
  "Nothing for now, I just wanted to answer",
] as const;

/** The exit option. Ticking it clears the others, and it asks for no contact details. */
export const NEXT_STEP_NONE = NEXT_STEPS[3];

export const SPEND_BANDS = [
  "Nothing structured",
  "Under ₹25,000",
  "₹25,000–1 lakh",
  "₹1–3 lakh",
  "Over ₹3 lakh",
  "Rather not say",
] as const;

/** The public address. Shown in the footer and on both legal pages. */
export const CONTACT_EMAIL: string | null =
  "aaditaa_vashisht@pg27.mesaschool.co";

/** The named lead guide. Signs the applicant and waitlist emails. */
export const GUIDE_NAME: string | null = null;

/** The age range the membership is built for, stated as a filter. */
export const AGE_RANGE = "40–60";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** End of the stated closing day, in India Standard Time. */
function closeInstant(): Date | null {
  if (!COHORT_CLOSE_DATE) return null;
  const d = new Date(`${COHORT_CLOSE_DATE}T23:59:59+05:30`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Derived in one place and used in three: the nav/hero CTA targets, the
 * application section, and the prominence of the waitlist band.
 * With no closing date set, the cohort reads as open.
 */
export function isCohortOpen(now: Date = new Date()): boolean {
  const close = closeInstant();
  return close ? now.getTime() <= close.getTime() : true;
}

/** "12 January 2027", or the visible marker when unset. */
export function closeDateLabel(): string {
  const close = closeInstant();
  if (!close) return "{{CLOSE_DATE}}";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(close);
}

/** The contact address, or the visible marker when unset. */
export function contactEmailLabel(): string {
  return CONTACT_EMAIL ?? "{{TBD}}";
}

/** The guide's name, or the visible marker when unset. Used in the emails. */
export function guideNameLabel(): string {
  return GUIDE_NAME ?? "{{TBD}}";
}
