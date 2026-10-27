import { NextResponse } from "next/server";

import { allRows } from "@/db/queries";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Protected CSV export, so the answers can go into a sheet alongside interview notes.
 *
 *   curl -H "Authorization: Bearer $EXPORT_TOKEN" \
 *        "$SITE/api/export?table=applications" -o applications.csv
 *
 * There is deliberately no admin dashboard. Neon's console already has a table
 * browser and a SQL editor, and a dashboard is a week of work with its own attack
 * surface for something a database GUI does better.
 */
export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || token !== env().EXPORT_TOKEN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const table = new URL(request.url).searchParams.get("table");
  if (table !== "applications" && table !== "waitlist") {
    return NextResponse.json(
      { ok: false, error: "table must be applications or waitlist" },
      { status: 400 },
    );
  }

  const rows = await allRows(table);
  const csv = toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${table}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const lines = [headers.map(cell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => cell(row[h])).join(","));
  }
  return `${lines.join("\r\n")}\r\n`;
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  // A leading =, +, - or @ makes a spreadsheet treat the cell as a formula.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
