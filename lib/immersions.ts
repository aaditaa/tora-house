/**
 * Every dated immersion, and everything the page derives from them. The banner,
 * the hero line, the nav, the invitation and the section all read from here, so
 * a date, a price or a seat count is written once.
 *
 * Pure and client-safe: no database. The paid-seat count lives in lib/seats.ts,
 * because it reads the database and must stay out of the browser bundle.
 */

export type ImmersionEvent = {
  slug: string;
  title: string;
  partner: string;
  venue: string;
  city: string;
  /** ISO with an explicit +05:30, so the instant is the same on any server. */
  startsAt: string;
  durationMins: number;
  /**
   * The total for one booking, by party size: prices[0] for one seat, prices[1]
   * for two. Its length is the most seats one booking can take.
   */
  prices: readonly number[];
  /** The room size. null renders a visible {{SEATS}} marker until it is known. */
  seats: number | null;
  openToNonMembers: boolean;
  includes: readonly string[];
  copy: {
    headline: string;
    lede: string;
    /** `{seats}` is replaced with the room size, spelled out. */
    body: string;
    /** One sentence for the invitation: what the hour holds. */
    inviteSummary: string;
  };
};

export const immersions: readonly ImmersionEvent[] = [
  {
    slug: "high-tea-and-pilates",
    title: "High Tea and Pilates",
    partner: "Maison de Medusa",
    venue: "Maison de Medusa, Whitefield",
    city: "Bengaluru",
    startsAt: "2026-12-05T10:00:00+05:30",
    durationMins: 60,
    prices: [2000, 3000],
    seats: 10,
    openToNonMembers: true,
    includes: [
      "Floor Pilates, 40 minutes, instructor-led",
      "An international high tea tasting",
      "A closed-group conversation",
    ],
    copy: {
      headline: "High tea and Pilates.",
      lede: "Forty minutes of floor Pilates, a tasting of teas from several countries, and the kind of conversation that only happens in a small room. At Maison de Medusa, in Whitefield.",
      body: "The first of the immersions, and the shortest way to see how the room works. You will not be the fittest person there, and you will not be the least. {seats} women, one teacher, a table laid afterwards, and nobody with a next appointment to get to.",
      inviteSummary:
        "Forty minutes of Pilates, a high tea tasting, and a conversation.",
    },
  },
] as const;

/**
 * Which ask leads while an immersion is on sale. "immersion" puts Reserve first
 * until the event starts and hands the page back to the waitlist after it;
 * "waitlist" keeps the waitlist first throughout. This is the one line to change.
 */
export const LEAD_WITH: "immersion" | "waitlist" = "immersion";

export function startOf(ev: ImmersionEvent): Date {
  return new Date(ev.startsAt);
}

export function endOf(ev: ImmersionEvent): Date {
  return new Date(startOf(ev).getTime() + ev.durationMins * 60_000);
}

/**
 * The soonest event that has not started, or null. Bookable until it begins:
 * nobody can reserve a seat at a session that is already under way.
 */
export function nextImmersion(now: Date = new Date()): ImmersionEvent | null {
  const ahead = immersions
    .filter((ev) => startOf(ev).getTime() > now.getTime())
    .sort((a, b) => startOf(a).getTime() - startOf(b).getTime());
  return ahead[0] ?? null;
}

/** The switch the whole page turns on. */
export function isUpcoming(now: Date = new Date()): boolean {
  return nextImmersion(now) !== null;
}

/** True when the immersion, rather than the waitlist, is the primary ask. */
export function immersionLeads(now: Date = new Date()): boolean {
  return LEAD_WITH === "immersion" && isUpcoming(now);
}

/**
 * What the section shows: the next event, or once they have all run, the most
 * recent one, marked as past.
 */
export function featuredImmersion(now: Date = new Date()): {
  ev: ImmersionEvent;
  past: boolean;
} | null {
  const next = nextImmersion(now);
  if (next) return { ev: next, past: false };
  const behind = [...immersions].sort(
    (a, b) => startOf(b).getTime() - startOf(a).getTime(),
  );
  return behind[0] ? { ev: behind[0], past: true } : null;
}

/** "one", "two" … by position in the array, for "Immersion one". */
export function ordinalOf(ev: ImmersionEvent): string {
  const i = immersions.findIndex((x) => x.slug === ev.slug);
  return numberWord(i + 1, { capital: false });
}

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];

/** "First" for the first in the array, for "First immersion". */
export function ordinalWordOf(ev: ImmersionEvent): string {
  const i = immersions.findIndex((x) => x.slug === ev.slug);
  return ORDINALS[i] ?? `Immersion ${i + 1}`;
}

/** The anchor every link to this event uses: #immersion-one, then -two. */
export function anchorOf(ev: ImmersionEvent): string {
  return `immersion-${ordinalOf(ev)}`;
}

/** The price is on the button: a bare "Reserve a seat" reads as dearer than it is. */
export function reserveLabelOf(ev: ImmersionEvent): string {
  return `Reserve a seat \u00B7 ${formatInr(fromPrice(ev))}`;
}

// ─── Price ──────────────────────────────────────────────────────────────────

/** One seat: the price the bar, the hero and the invitation quote. */
export function fromPrice(ev: ImmersionEvent): number {
  return ev.prices[0] ?? 0;
}

/** The most seats one booking can take: one per entry in the price table. */
export function maxSeatsOf(ev: ImmersionEvent): number {
  return ev.prices.length;
}

/** The total for a party of `seats`, or null if that size cannot be booked. */
export function priceFor(ev: ImmersionEvent, seats: number): number | null {
  if (!Number.isInteger(seats) || seats < 1) return null;
  return ev.prices[seats - 1] ?? null;
}

/** "₹2,000 for one, ₹3,000 for two". */
export function formatPrices(ev: ImmersionEvent): string {
  return ev.prices
    .map(
      (p, i) => `${formatInr(p)} for ${numberWord(i + 1, { capital: false })}`,
    )
    .join(", ");
}

/** "1 seat · ₹2,000", for the seat picker. */
export function seatOptionLabel(ev: ImmersionEvent, seats: number): string {
  const price = priceFor(ev, seats);
  const noun = seats === 1 ? "seat" : "seats";
  return price === null
    ? `${seats} ${noun}`
    : `${seats} ${noun} \u00B7 ${formatInr(price)}`;
}

/** "Whitefield": the area, from the end of the venue line. */
export function areaOf(ev: ImmersionEvent): string {
  return ev.venue.split(",").pop()?.trim() ?? ev.city;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

const IST = "Asia/Kolkata";

const DAY = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const CLOCK = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST,
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

function clockParts(d: Date): { h: number; m: number } {
  const parts = CLOCK.formatToParts(d);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return { h, m };
}

function clock(d: Date, withPeriod: boolean): string {
  const { h, m } = clockParts(d);
  const h12 = ((h + 11) % 12) + 1;
  const mins = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
  return `${h12}${mins}${withPeriod ? (h < 12 ? "am" : "pm") : ""}`;
}

/**
 * "Saturday 5 December, 10am", or with `range`, "Saturday 5 December, 10–11am".
 * Day name, no year, lowercase am/pm, always in IST. The period is stated once
 * when both ends share it, and on both sides when the range crosses noon.
 *
 * The range carries invisible word joiners round its dash. Strip them with
 * `plain()` before the string goes anywhere a joiner would be a nuisance, such
 * as an email subject.
 */
export function formatWhen(
  ev: ImmersionEvent,
  { range = false }: { range?: boolean } = {},
): string {
  const start = startOf(ev);
  const day = DAY.format(start).replace(",", "");
  if (!range) return `${day}, ${clock(start, true)}`;
  const end = endOf(ev);
  const samePeriod = clockParts(start).h < 12 === clockParts(end).h < 12;
  // Word joiners either side of the en dash: a browser will otherwise break a
  // narrow column after it and leave "10–" on one line and "11am" on the next.
  return `${day}, ${clock(start, !samePeriod)}⁠–⁠${clock(end, true)}`;
}

/** "10am": the start alone, for a sentence that already names the day. */
export function formatTime(ev: ImmersionEvent): string {
  return clock(startOf(ev), true);
}

/** "12:40pm" in IST, for any moment: when a hold on her seats lapses. */
export function formatClock(d: Date): string {
  return clock(d, true);
}

/** A formatted string with its layout-only word joiners removed. */
export function plain(text: string): string {
  return text.replace(/⁠/g, "");
}

/** "Saturday 5 December", for the places that carry the day alone. */
export function formatDay(ev: ImmersionEvent): string {
  return DAY.format(startOf(ev)).replace(",", "");
}

/** ₹2,000. The comma stays in, the symbol is attached, there are no decimals. */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** "One session, 60 minutes". */
export function formatFormat(ev: ImmersionEvent): string {
  return `One session, ${ev.durationMins} minutes`;
}

// ─── Seats ──────────────────────────────────────────────────────────────────

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

export function numberWord(n: number, { capital = true } = {}): string {
  const w = WORDS[n] ?? String(n);
  return capital ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

export type SeatState = "unknown" | "open" | "few" | "full";

/**
 * Honest seat copy and nothing else. "10 seats left" while there is room, the
 * number spelled out at three or fewer, and full at zero. No "filling fast":
 * every number on this page has to be true for the biomarker claims beside it
 * to be believed.
 *
 * `left` is null when the paid count could not be read, in which case the room
 * size is shown rather than a guess at what is left of it.
 */
export function seatCopy(
  seats: number | null,
  left: number | null,
): { state: SeatState; detail: string; line: string | null } {
  if (seats === null) {
    return { state: "unknown", detail: "{{SEATS}}", line: null };
  }
  if (left !== null && left <= 0) {
    return { state: "full", detail: "Full", line: "This one is full." };
  }
  if (left !== null && left <= 3) {
    const word = numberWord(left);
    const noun = left === 1 ? "seat" : "seats";
    return {
      state: "few",
      detail: `${word} ${noun} left`,
      line: `${word} ${noun} left.`,
    };
  }
  return {
    state: "open",
    detail: left === null ? `${seats} seats` : `${left} seats left`,
    line: null,
  };
}

/** The room size for the body copy: spelled out, or the visible marker. */
export function seatsWord(seats: number | null): string {
  return seats === null ? "{{SEATS}}" : numberWord(seats);
}
