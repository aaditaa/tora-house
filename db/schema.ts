import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Two tables that answer two different questions. A woman may legitimately be on the
 * waitlist and later apply; the rows are not merged or deduplicated across tables,
 * because keeping them apart is what makes the funnel readable.
 */

export const applications = pgTable(
  "applications",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    /**
     * Required of every submission by the form and the payload schema. The column is
     * still nullable only because two pre-launch rows were written when answering
     * anonymously was possible; nothing writes NULL any more. Making it NOT NULL is
     * part of the cleanup in the README, held back because it cannot be applied while
     * those rows exist and dropping them is not a decision code should make.
     */
    email: text("email"),

    /** Optional second channel. Indian numbers are normalised to +91 before they land. */
    phone: text("phone"),

    /**
     * "I'm interested to hear more about this" \u2014 the one thing she opts in to.
     * Supplying an address is what lets us reply to the questionnaire; this is the
     * separate question of whether she wants anything beyond that reply.
     */
    hearMore: boolean("hear_more").notNull().default(false),

    ageBand: text("age_band").notNull(),
    city: text("city").notNull(),

    /** Questions three and four. The same option list, so the gap is readable. */
    interests: text("interests").array().notNull(),
    practicesToday: text("practices_today").array().notNull(),

    workoutMode: text("workout_mode").notNull(),

    recentAttempts: text("recent_attempts").notNull(),
    whatInterrupts: text("what_interrupts").notNull(),
    spendBand: text("spend_band").notNull(),
    yearFromNow: text("year_from_now").notNull(),

    /**
     * The old question ten, which no longer exists on the form. Kept so the rows
     * written before it was removed keep their answers; nothing writes it now, and it
     * defaults to an empty array so inserts do not need to. See the cleanup note in
     * the README \u2014 this column and research_optin are both dead weight once you have
     * decided what to do with the rows that still use them.
     */
    nextSteps: text("next_steps").array().notNull().default([]),

    /**
     * True on every new row: she supplied an address so that we could reply, and the
     * form says so beside the field. It no longer distinguishes between rows, and is
     * in the same cleanup list as next_steps. hear_more is the column that now carries
     * a real choice.
     */
    consentContact: boolean("consent_contact").notNull(),

    /**
     * The interview pipeline, and nothing sets it any more: the twenty-minute
     * conversation was one of the four options that were removed. False on every new
     * row until something asks the question again.
     */
    researchOptin: boolean("research_optin").notNull().default(false),

    /** new | reviewing | invited | declined | member — set by hand in the Neon console. */
    status: text("status").notNull().default("new"),

    utm: jsonb("utm"),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("applications_created_at_idx").on(table.createdAt.desc()),
    // Case-insensitive. A resubmission conflicts rather than duplicating.
    uniqueIndex("applications_email_idx").on(sql`lower(${table.email})`),
  ],
);

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    city: text("city").notNull(),
    note: text("note"),
    consentContact: boolean("consent_contact").notNull(),

    /** Which entry point she came through. */
    source: text("source"),
    utm: jsonb("utm"),
    referrer: text("referrer"),
  },
  (table) => [uniqueIndex("waitlist_email_idx").on(sql`lower(${table.email})`)],
);

export type ApplicationRow = typeof applications.$inferSelect;
export type WaitlistRow = typeof waitlist.$inferSelect;
