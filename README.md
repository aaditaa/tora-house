# Founding cohort — landing page and application

A single-page marketing site with an embedded three-step application, a waitlist, and a
Neon-backed data layer. Next.js 15 (App Router, React Server Components), Tailwind CSS v4,
Drizzle ORM, Resend, Zod. Deploy target is Vercel.

No component library and no animation library: every component here is hand-built, because
a library's defaults are exactly the templated look this page has to avoid.

**Read [PLACEHOLDERS.md](PLACEHOLDERS.md) first.** The brand name, cohort size, closing
date, contact details, price and photography are all unfilled and render as visible
`{{...}}` markers. Nothing has been invented to fill them.

---

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill it in, see below
npm run dev                  # http://localhost:3000
```

Useful routes while building:

| Route | What it is |
| --- | --- |
| `/` | The page |
| `/styleguide` | Type scale, palette and measured contrast. Not indexed. |
| `/privacy`, `/terms` | The legal pages |

```bash
npm run build       # production build; runs lint and type-checking
npm run typecheck   # tsc --noEmit on its own
npm run lint        # eslint on its own
```

## Environment variables

All six are required, all are server-only except the first, and all are validated at
server start by `lib/env.ts` via `instrumentation.ts`. In production a missing variable
stops the boot and names every one that is wrong; in development it is printed as a
warning so the page can be worked on without a database to hand.

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, no trailing slash. Canonical URLs, OG tags, sitemap. |
| `DATABASE_URL` | The **pooled** Neon connection string — the host containing `-pooler`. Never prefix this `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | From the Resend dashboard. |
| `NOTIFY_EMAIL` | Where application alerts and the daily waitlist digest go. |
| `FROM_EMAIL` | A verified Resend sender, e.g. `Name <hello@yourdomain.com>`. |
| `EXPORT_TOKEN` | Long random string. Bearer token for the CSV export and the digest cron. |

`.env.local` is gitignored. `.env.example` is committed with the keys and empty values.

## Database

Two tables, `applications` and `waitlist`, defined in [`db/schema.ts`](db/schema.ts). They
answer two different questions: a woman may legitimately be on the waitlist and later
apply, and the rows are deliberately **not** merged or deduplicated across the tables,
because keeping them apart is what makes the funnel readable.

### Running the migration

The generated SQL is committed in `drizzle/`. To apply it to a Neon branch:

```bash
npm run db:migrate              # applies drizzle/*.sql using DATABASE_URL
npm run db:generate             # regenerate after changing db/schema.ts
```

### Use a Neon branch for development

This is the main practical advantage Neon gives here, and it is worth doing on day one
rather than cleaning fake rows out of production later.

1. In the Neon console, create a branch off `main` named **`dev`**.
2. Copy that branch's **pooled** connection string into `.env.local` as `DATABASE_URL`.
3. Keep the `main` branch's pooled string for the Vercel production environment only.

Test submissions then land in `dev` and never touch the real table.

> **Branch in use for local development: `dev`.**

### Unique on lowercased email

Both tables carry `unique index ... (lower(email))`. A resubmission therefore conflicts
rather than duplicating, and both routes upsert and tell her plainly that her details are
already in — a woman who submits twice has done nothing wrong.

Those two upserts are written out as SQL in [`db/queries.ts`](db/queries.ts) rather than
using drizzle's `onConflictDoUpdate()`. That builder escapes its conflict target as a
column name and cannot express `on conflict (lower(email))`. The index is worth keeping as
it is: it guarantees one row per person at the database level even if a future code path
forgets to normalise the address.

## API routes

All `runtime = "nodejs"`. There is no browser-facing database client and no row-level
security to get right: the database is reachable only from server code holding the
connection string, so every write goes through one of these.

| Route | Method | Notes |
| --- | --- | --- |
| `/api/apply` | POST | Validates, rejects bots, upserts, sends two emails, returns `{ ok: true, duplicate }`. |
| `/api/waitlist` | POST | Same shape. Joins are notified as a daily digest, not individually. |
| `/api/waitlist/digest` | GET | Bearer `EXPORT_TOKEN`. Sends the last 24 hours as one email. Run by cron. |
| `/api/export` | GET | Bearer `EXPORT_TOKEN`. `?table=applications\|waitlist`. Returns CSV. |

Bot handling: a filled honeypot, or a form completed in under four seconds, gets a plain
`{ ok: true }` and nothing is written — the bot learns nothing. A failed email send is
logged and still returns success, because the record is stored and that is what matters.
A failed database write returns 500 with a message the client shows, keeping every answer
in state and offering a mailto fallback.

**Rate limiting** is five requests per IP per hour, per route, held in an in-memory map
(`lib/rate-limit.ts`). It resets on a cold start and is per-instance. That is deliberate
for launch; if abuse appears, move it to Upstash — the call site does not change.

### Pulling the CSV export

```bash
curl -H "Authorization: Bearer $EXPORT_TOKEN" \
  "https://yourdomain.com/api/export?table=applications" -o applications.csv
```

Applications with `research_optin = true` are your interview pipeline. Pull them into the
same sheet as the interview notes so the form answers and the call notes sit side by side
when you synthesise.

There is deliberately **no admin dashboard**. Neon's console has a table browser and a SQL
editor, which is enough for the first weeks and adds no attack surface.

## Deploying to Vercel

1. Push the repository to GitHub and import it in Vercel. The framework is detected; no
   build settings need changing.
2. Add all six environment variables to the Production environment. `DATABASE_URL` must be
   the pooled string from the Neon `main` branch.
3. Add `CRON_SECRET` with **the same value as `EXPORT_TOKEN`**. Vercel's cron sends
   `Authorization: Bearer $CRON_SECRET`, and the digest route checks it against
   `EXPORT_TOKEN`.
4. Deploy, then set `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy so canonical
   URLs, OG tags and the sitemap point at it.
5. Run the migration once against the production branch.

`vercel.json` registers the daily waitlist digest at 02:30 UTC (08:00 IST).

## Open and closed states

`COHORT_CLOSE_DATE` in [`lib/config.ts`](lib/config.ts) is the only place the date exists.
`isCohortOpen()` derives from it and is used in three places: the nav and hero CTAs, the
application section, and the prominence of the waitlist band.

- **Open** — the application is the primary call to action everywhere; the waitlist sits
  near the bottom under "Not this cohort".
- **Closed** — nav and hero CTAs point at the waitlist, the application section collapses
  to a short statement naming the date it closed and the cohort size that filled, and the
  waitlist band moves up in prominence.

Both states are built. Test by changing the date and reloading; the page revalidates
hourly, so a live site flips within an hour of the deadline without a deploy.

## Design system

Tokens are defined as CSS custom properties in `app/globals.css` and exposed to Tailwind
through `@theme inline`. No raw hex belongs in a component. There are two tiers: a fixed
palette (`--bone`, `--sand`, `--clay`, `--umber`, …) and a semantic layer
(`--surface`, `--fg`, `--fg-muted`, `--rule`, `--link`) that `.on-dark` and the print
stylesheet remap, so the same components work on a light or an umber ground.

Three deepened variants exist purely to clear the 4.5:1 contrast bar, with the measured
ratios in `/styleguide`:

| Token | Why |
| --- | --- |
| `--clay-deep` | `--clay` on `--bone` is 4.09:1. Used for links, filled buttons and errors; `--clay` stays the accent for rules and focus rings. |
| `--sage-deep` | `--sage` on `--bone` is 3.20:1. |
| `--muted-deep` | `--muted` on `--linen` is 3.97:1. Used inside the image placeholder blocks. |

Motion is one pattern: fade in and rise 16px, 700ms, once, at 15% visibility, staggered
80ms (120ms between hero lines). The hiding class is added by JavaScript on mount, so a
visitor whose JS never runs sees the content rather than a blank page. Everything is
disabled under `prefers-reduced-motion: reduce`.

## Print

`@media print` in `app/globals.css` turns the page into a clean brochure: nav, forms,
waitlist and grain hidden, dark sections flipped onto paper, the grid collapsed to one
column, images kept, and a footer rule carrying the brand name and the application URL.
