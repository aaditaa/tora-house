import { NextResponse } from "next/server";

import { waitlistSince } from "@/db/queries";
import { sendWaitlistDigest } from "@/lib/email";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The daily waitlist digest. Called by the Vercel cron in vercel.json, which sends
 * `Authorization: Bearer $CRON_SECRET` — so set CRON_SECRET to the same value as
 * EXPORT_TOKEN in the Vercel project. Safe to call by hand with the same header.
 */
export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || token !== env().EXPORT_TOKEN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await waitlistSince(since);

  try {
    await sendWaitlistDigest(rows);
  } catch (error) {
    console.error("[waitlist-digest] email send failed", error);
    return NextResponse.json({ ok: false, counted: rows.length }, { status: 500 });
  }

  return NextResponse.json({ ok: true, counted: rows.length });
}
