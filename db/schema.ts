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
     * Nullable on purpose. Question ten lets a woman answer and ask for nothing;
     * she is not made to hand over an address she had no reason to give. The unique
     * index below is on lower(email), and Postgres treats NULLs as distinct, so
     * anonymous answers never collide with each other.
     */
    fullName: text("full_name"),
    email: text("email"),

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

    /** Question ten, kept whole. */
    nextSteps: text("next_steps").array().notNull(),

    /** Derived from next_steps at write time, so triage and export stay simple. */
    consentContact: boolean("consent_contact").notNull(),
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
