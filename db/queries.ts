import { sql } from "drizzle-orm";

import { db } from "./index";

/**
 * The unique indexes are on lower(email), which Postgres can only reach through an
 * expression conflict target — `on conflict (lower(email))`. drizzle's
 * onConflictDoUpdate() builder escapes its target as a column name and cannot express
 * that, so these upserts are written out. The index is worth keeping as it is: it
 * guarantees one row per person at the database level even if a future code path
 * forgets to normalise the address.
 *
 * `xmax <> 0` in the RETURNING clause is how Postgres tells an insert from an update,
 * which is what lets the route say "your details are already in" rather than showing
 * an error to a woman who has done nothing wrong.
 */

export type UpsertResult = { id: string; duplicate: boolean };

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
export type ImmersionBookingInsert = {
  immersionSlug: string;
  fullName: string;
  email: string;
  phone: string | null;
  seats: number;
  dietary: string | null;
  heard: string | null;
  memberStatus: string;
  amountInr: number;
  source: string | null;
  utm: Record<string, string> | null;
  referrer: string | null;
};

/** What the booking route needs to know about an existing request. */
export type ImmersionBookingRow = {
  id: string;
  immersionSlug: string;
  fullName: string;
  email: string;
  phone: string | null;
  seats: number;
  status: string;
  amountInr: number | null;
  paymentLinkId: string | null;
  paymentLinkUrl: string | null;
  holdUntil: Date | null;
  /** Campaign tags and Meta's browser IDs from the moment she booked. */
  utm: Record<string, string> | null;
};

type RawBooking = {
  id: string;
  immersion_slug: string;
  full_name: string;
  email: string;
  phone: string | null;
  seats: number | string;
  status: string;
  amount_inr: number | string | null;
  payment_link_id: string | null;
  payment_link_url: string | null;
  hold_until: string | Date | null;
  utm: Record<string, string> | string | null;
};

function toBooking(r: RawBooking): ImmersionBookingRow {
  return {
    id: String(r.id),
    immersionSlug: r.immersion_slug,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    seats: Number(r.seats),
    status: r.status,
    amountInr: r.amount_inr === null ? null : Number(r.amount_inr),
    paymentLinkId: r.payment_link_id,
    paymentLinkUrl: r.payment_link_url,
    holdUntil: r.hold_until === null ? null : new Date(r.hold_until),
    utm:
      r.utm === null
        ? null
        : typeof r.utm === "string"
          ? (JSON.parse(r.utm) as Record<string, string>)
          : r.utm,
  };
}

const BOOKING_COLUMNS = sql`id, immersion_slug, full_name, email, phone, seats, status,
  amount_inr, payment_link_id, payment_link_url, hold_until, utm`;

/** Her existing request for this immersion, if she has made one. */
export async function findImmersionBooking(
  immersionSlug: string,
  email: string,
): Promise<ImmersionBookingRow | null> {
  const rows = await db().execute<RawBooking>(sql`
    select ${BOOKING_COLUMNS} from immersion_bookings
    where immersion_slug = ${immersionSlug} and lower(email) = lower(${email})
  `);
  const row = rowsOf(rows)[0];
  return row ? toBooking(row) : null;
}

/** The booking a Razorpay payment link was made for. */
export async function findBookingByLink(
  paymentLinkId: string,
): Promise<ImmersionBookingRow | null> {
  const rows = await db().execute<RawBooking>(sql`
    select ${BOOKING_COLUMNS} from immersion_bookings
    where payment_link_id = ${paymentLinkId}
  `);
  const row = rowsOf(rows)[0];
  return row ? toBooking(row) : null;
}

/**
 * One row per woman per immersion: asking twice updates her request rather than
 * holding two places. A booking already marked paid or cancelled keeps its status.
 */
export async function upsertImmersionBooking(
  v: ImmersionBookingInsert,
): Promise<UpsertResult> {
  const rows = await db().execute<{ id: string; updated: boolean }>(sql`
    insert into immersion_bookings
      (immersion_slug, full_name, email, phone, seats, dietary, heard, member_status, amount_inr, source, utm, referrer)
    values (
      ${v.immersionSlug}, ${v.fullName}, ${v.email}, ${v.phone}, ${v.seats}, ${v.dietary},
      ${v.heard}, ${v.memberStatus}, ${v.amountInr}, ${v.source},
      ${v.utm ? JSON.stringify(v.utm) : null}::jsonb, ${v.referrer}
    )
    on conflict (immersion_slug, lower(email)) do update set
      full_name = excluded.full_name,
      phone = coalesce(excluded.phone, immersion_bookings.phone),
      seats = excluded.seats,
      dietary = coalesce(excluded.dietary, immersion_bookings.dietary),
      heard = coalesce(excluded.heard, immersion_bookings.heard),
      member_status = excluded.member_status,
      amount_inr = excluded.amount_inr
    returning id, (xmax <> 0) as updated
  `);

  const row = rowsOf(rows)[0]!;
  return { id: String(row.id), duplicate: Boolean(row.updated) };
}

/**
 * Seats taken: every paid seat, plus every seat held by an unpaid request whose
 * payment link is still open. A request with no link, or a lapsed one, holds
 * nothing. `except` leaves one booking out, so someone changing her own request
 * is not counted against herself.
 */
export async function takenSeats(
  immersionSlug: string,
  except: string | null = null,
): Promise<number> {
  const rows = await db().execute<{ seats: string | number | null }>(sql`
    select coalesce(sum(seats), 0) as seats
    from immersion_bookings
    where immersion_slug = ${immersionSlug}
      and (status = 'paid' or (status = 'requested' and hold_until > now()))
      and (${except}::uuid is null or id <> ${except}::uuid)
  `);
  return Number(rowsOf(rows)[0]?.seats ?? 0);
}

/** Paid seats only: what the room actually holds, for the over-capacity check. */
export async function paidSeats(immersionSlug: string): Promise<number> {
  const rows = await db().execute<{ seats: string | number | null }>(sql`
    select coalesce(sum(seats), 0) as seats
    from immersion_bookings
    where immersion_slug = ${immersionSlug} and status = 'paid'
  `);
  return Number(rowsOf(rows)[0]?.seats ?? 0);
}

/** Records the link made for a booking, and holds its seats until it lapses. */
export async function setBookingPaymentLink(
  id: string,
  link: { id: string; url: string; holdUntil: Date },
): Promise<void> {
  await db().execute(sql`
    update immersion_bookings
    set payment_link_id = ${link.id},
        payment_link_url = ${link.url},
        hold_until = ${link.holdUntil.toISOString()}::timestamptz
    where id = ${id}::uuid
  `);
}

/**
 * Marks the booking behind a payment link as paid. Returns the booking the first
 * time, and null after that, so Razorpay's webhook and her return to the site can
 * both report the same payment without either sending the emails twice.
 */
export async function markBookingPaid(
  paymentLinkId: string,
  paymentId: string | null,
): Promise<ImmersionBookingRow | null> {
  const rows = await db().execute<RawBooking>(sql`
    update immersion_bookings
    set status = 'paid', paid_at = now(), payment_id = ${paymentId}
    where payment_link_id = ${paymentLinkId} and status = 'requested'
    returning ${BOOKING_COLUMNS}
  `);
  const row = rowsOf(rows)[0];
  return row ? toBooking(row) : null;
}

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
