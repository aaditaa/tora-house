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

    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    city: text("city").notNull(),
    ageBand: text("age_band").notNull(),
    occupation: text("occupation").notNull(),

    recentAttempts: text("recent_attempts").notNull(),
    whatInterrupts: text("what_interrupts").notNull(),
    spendBand: text("spend_band").notNull(),
    yearFromNow: text("year_from_now").notNull(),
    trainsCompetitively: boolean("trains_competitively").notNull(),
    referralSource: text("referral_source").notNull(),

    offlineAvailability: text("offline_availability").notNull(),
    notes: text("notes"),
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
