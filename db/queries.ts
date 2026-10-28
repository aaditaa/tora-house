import { sql, type SQL } from "drizzle-orm";

import { db } from "./index";

/**
 * The unique indexes are on lower(email), which Postgres can only reach through an
 * expression conflict target — `on conflict (lower(email))`. drizzle's
 * onConflictDoUpdate() builder escapes its target as a column name and cannot express
 * that, so these two upserts are written out. The index is worth keeping as it is: it
 * guarantees one row per person at the database level even if a future code path
 * forgets to normalise the address.
 *
 * `xmax <> 0` in the RETURNING clause is how Postgres tells an insert from an update,
 * which is what lets the route say "your details are already in" rather than showing
 * an error to a woman who has done nothing wrong.
 */

/**
 * A text[] parameter, built from JSON so the values stay parameterised and keep their
 * order. Hand-built array literals are the usual way an injection gets in here.
 */
function textArray(values: readonly string[]): SQL {
  return sql`(
    select coalesce(array_agg(value order by ord), '{}')::text[]
    from jsonb_array_elements_text(${JSON.stringify(values)}::jsonb) with ordinality as t(value, ord)
  )`;
}

export type ApplicationInsert = {
  fullName: string | null;
  email: string | null;
  ageBand: string;
  city: string;
  interests: readonly string[];
  practicesToday: readonly string[];
  workoutMode: string;
  recentAttempts: string;
  whatInterrupts: string;
  spendBand: string;
  yearFromNow: string;
  nextSteps: readonly string[];
  consentContact: boolean;
  researchOptin: boolean;
  utm: Record<string, string> | null;
  referrer: string | null;
  userAgent: string | null;
};

export type UpsertResult = { id: string; duplicate: boolean };

export async function upsertApplication(
  v: ApplicationInsert,
): Promise<UpsertResult> {
  const rows = await db().execute<{ id: string; updated: boolean }>(sql`
    insert into applications (
      full_name, email, age_band, city,
      interests, practices_today, workout_mode,
      recent_attempts, what_interrupts, spend_band, year_from_now,
      next_steps, consent_contact, research_optin,
      utm, referrer, user_agent
    ) values (
      ${v.fullName}, ${v.email}, ${v.ageBand}, ${v.city},
      ${textArray(v.interests)}, ${textArray(v.practicesToday)}, ${v.workoutMode},
      ${v.recentAttempts}, ${v.whatInterrupts}, ${v.spendBand}, ${v.yearFromNow},
      ${textArray(v.nextSteps)}, ${v.consentContact}, ${v.researchOptin},
      ${v.utm ? JSON.stringify(v.utm) : null}::jsonb, ${v.referrer}, ${v.userAgent}
    )
    on conflict (lower(email)) do update set
      full_name = excluded.full_name,
      age_band = excluded.age_band,
      city = excluded.city,
      interests = excluded.interests,
      practices_today = excluded.practices_today,
      workout_mode = excluded.workout_mode,
      recent_attempts = excluded.recent_attempts,
      what_interrupts = excluded.what_interrupts,
      spend_band = excluded.spend_band,
      year_from_now = excluded.year_from_now,
      next_steps = excluded.next_steps,
      consent_contact = excluded.consent_contact,
      research_optin = excluded.research_optin,
      utm = coalesce(excluded.utm, applications.utm),
      referrer = coalesce(excluded.referrer, applications.referrer),
      user_agent = excluded.user_agent
    returning id, (xmax <> 0) as updated
  `);

  const row = rowsOf(rows)[0]!;
  return { id: String(row.id), duplicate: Boolean(row.updated) };
}

export type WaitlistInsert = {
  fullName: string;
  email: string;
  city: string;
  note: string | null;
  consentContact: boolean;
  source: string | null;
  utm: Record<string, string> | null;
  referrer: string | null;
};

export async function upsertWaitlistEntry(
  v: WaitlistInsert,
): Promise<UpsertResult> {
  const rows = await db().execute<{ id: string; updated: boolean }>(sql`
    insert into waitlist (full_name, email, city, note, consent_contact, source, utm, referrer)
    values (
      ${v.fullName}, ${v.email}, ${v.city}, ${v.note}, ${v.consentContact}, ${v.source},
      ${v.utm ? JSON.stringify(v.utm) : null}::jsonb, ${v.referrer}
    )
    on conflict (lower(email)) do update set
      full_name = excluded.full_name,
      city = excluded.city,
      note = coalesce(excluded.note, waitlist.note),
      consent_contact = excluded.consent_contact,
      source = coalesce(excluded.source, waitlist.source),
      utm = coalesce(excluded.utm, waitlist.utm),
      referrer = coalesce(excluded.referrer, waitlist.referrer)
    returning id, (xmax <> 0) as updated
  `);

  const row = rowsOf(rows)[0]!;
  return { id: String(row.id), duplicate: Boolean(row.updated) };
}

/** Waitlist joins since a given time, for the daily digest. */
export async function waitlistSince(since: Date) {
  const rows = await db().execute<{
    full_name: string;
    email: string;
    city: string;
    note: string | null;
    created_at: string;
  }>(sql`
    select full_name, email, city, note, created_at
    from waitlist
    where created_at >= ${since.toISOString()}
    order by created_at asc
  `);
  return rowsOf(rows);
}

/** Every row of a table, newest first, for the CSV export. */
export async function allRows(table: "applications" | "waitlist") {
  const query =
    table === "applications"
      ? sql`select * from applications order by created_at desc`
      : sql`select * from waitlist order by created_at desc`;
  const rows = await db().execute<Record<string, unknown>>(query);
  return rowsOf(rows);
}

/**
 * The neon-http driver returns the rows array directly for some queries and a
 * { rows } result object for others depending on the driver version, so normalise.
 */
function rowsOf<T>(result: T[] | { rows: T[] }): T[] {
  return Array.isArray(result) ? result : result.rows;
}
