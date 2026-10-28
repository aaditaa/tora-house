# Founding cohort — landing page and application

A single-page marketing site with an embedded three-step application, a waitlist, and a
Neon-backed data layer. Next.js 15 (App Router, React Server Components), Tailwind CSS v4,
Drizzle ORM, Resend, Zod. Deploy target is Vercel.

No component library and no animation library: every component here is hand-built, because
a library's defaults are exactly the templated look this page has to avoid.

**Read [PLACEHOLDERS.md](PLACEHOLDERS.md) first.** The brand is in place; the cohort
size, closing date, contact details and price are still unfilled and render as visible
`{{...}}` markers. The photography is stand-in only — see the casting and licensing
notes there before this page goes anywhere public.

---

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill it in, see below
npm run dev                  # http://localhost:3000
```

Useful routes while building:

| Route                | What it is                                              |
| -------------------- | ------------------------------------------------------- |
| `/`                  | The page                                                |
| `/styleguide`        | Type scale, palette and measured contrast. Not indexed. |
| `/privacy`, `/terms` | The legal pages                                         |

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

| Variable               | What it is                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, no trailing slash. Canonical URLs, OG tags, sitemap.                                      |
| `DATABASE_URL`         | The **pooled** Neon connection string — the host containing `-pooler`. Never prefix this `NEXT_PUBLIC_`. |
| `RESEND_API_KEY`       | From the Resend dashboard.                                                                               |
| `NOTIFY_EMAIL`         | Where application alerts and the daily waitlist digest go.                                               |
| `FROM_EMAIL`           | A verified Resend sender, e.g. `Name <hello@yourdomain.com>`.                                            |
| `EXPORT_TOKEN`         | Long random string. Bearer token for the CSV export and the digest cron.                                 |

`.env.local` is gitignored. `.env.example` is committed with the keys and empty values.

## Database

Two tables, `applications` and `waitlist`, defined in [`db/schema.ts`](db/schema.ts). They
answer two different questions, and the rows are deliberately **not** merged or
deduplicated across the tables, because keeping them apart is what makes the funnel
readable.

`applications` holds the ten-question questionnaire. Two of its columns are `text[]` —
`interests` and `practices_today` — and they carry the same option list on purpose: the
gap between what someone is drawn to and what they actually do is the most useful single
output of the form, and an identical list makes that a direct comparison rather than a
coding exercise. `next_steps` is also `text[]`, and `consent_contact` and
`research_optin` are derived from it at write time rather than asked separately.

`full_name` and `email` are **nullable**. The last question offers an exit — "Nothing for
now, I just wanted to answer" — and someone who takes it is never asked who they are.
Postgres treats NULLs as distinct in a unique index, so anonymous answers never collide.

### Running the migration

The generated SQL is committed in `drizzle/`, as a single migration — the history was
squashed while the question set was still changing and nothing was deployed. If you have
already run an earlier version against a database, drop those two tables and run this
once rather than trying to migrate across it.

To apply it to a Neon branch:

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

| Route                  | Method | Notes                                                                                  |
| ---------------------- | ------ | -------------------------------------------------------------------------------------- |
| `/api/apply`           | POST   | Validates, rejects bots, upserts, sends two emails, returns `{ ok: true, duplicate }`. |
| `/api/waitlist`        | POST   | Same shape. Joins are notified as a daily digest, not individually.                    |
| `/api/waitlist/digest` | GET    | Bearer `EXPORT_TOKEN`. Sends the last 24 hours as one email. Run by cron.              |
| `/api/export`          | GET    | Bearer `EXPORT_TOKEN`. `?table=applications\|waitlist`. Returns CSV.                   |

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

## Where this is deployed

| | |
| --- | --- |
| Live | https://tora-house-flame.vercel.app |
| Repository | https://github.com/aaditaa/tora-house (private) |
| Vercel project | `tora-house`, personal account `aaditaavashisht15-7741` |
| Database | Neon project `tora-house` ... see below |

### The database

The Neon organisation on this account is managed by Vercel, which means new Neon
*projects* cannot be created through the API. Rather than put these tables in the
`public` schema of the existing project — which belongs to a different app — the site
uses a **separate database** inside it:

- Neon project `neon-cordovan-flower` (`shiny-lake-61837632`), branch `main`
- Database **`tora_house`**, owner `neondb_owner`
- `DATABASE_URL` is the pooled connection string for that database

That gives full isolation: different database, no shared tables, no risk to the other
app's data. If you would rather have a Neon project of its own, create one from the
Vercel dashboard's Storage tab and swap `DATABASE_URL`; nothing else changes.

The schema is already applied. There is no `dev` branch yet — create one from the Neon
console when you want local work to stop writing to the live table.

### Reading the responses

Two ways, by design — there is deliberately no admin dashboard.

1. **The Neon console.** Open the `tora_house` database and browse `applications` and
   `waitlist`, or use the SQL editor. This query is the useful one, because it shows the
   gap between what someone is drawn to and what they actually do:

   ```sql
   select created_at, coalesce(email,'(anonymous)') as email, city, age_band,
          array_to_string(interests,' · ')       as drawn_to,
          array_to_string(practices_today,' · ') as doing_now,
          array_to_string(next_steps,' · ')      as wants,
          what_interrupts
   from applications
   order by created_at desc;
   ```

2. **The CSV export**, for pulling answers into a sheet alongside interview notes:

   ```bash
   curl -H "Authorization: Bearer $EXPORT_TOKEN" \
     "https://tora-house-flame.vercel.app/api/export?table=applications" -o applications.csv
   ```

   `EXPORT_TOKEN` is in the Vercel project's environment variables. Rows with
   `research_optin = true` are your interview pipeline.

### Three things that are not finished

The site is deployed and current as of 28 October 2026. The deployment that was
previously blocked has run: Vercel refuses a deployment whose commit author is not
allowed to deploy the project, and the earlier commits here were authored
`Claude <noreply@anthropic.com>`. The commits now carry your identity from
`~/.gitconfig`, the deploy went through, and the canonical tag and OG URL serve
`https://tora-house-flame.vercel.app` rather than the stranger's `tora-house.vercel.app`.
Keep that identity: the convention is that you are the author and Claude the co-author,
and Vercel enforces it.

- **Auto-deploy on push is not connected,** and the last step is a GitHub permission
  only you can grant. Vercel's GitHub app is installed on the `aaditaa` account but set
  to *Only select repositories*, and the selected set is `flat-search` and `BharoTAX`.
  It cannot see `tora-house`, so `vercel git connect` fails with "Make sure there aren't
  any typos and that you have access to the repository if it's private."

  To clear it, open <https://github.com/settings/installations/125254679>, under
  Repository access add `aaditaa/tora-house`, save, then from this folder:

  ```bash
  npx vercel git connect --yes
  ```

  Everything downstream is already in place: `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`,
  `RESEND_API_KEY`, `FROM_EMAIL`, `NOTIFY_EMAIL`, `EXPORT_TOKEN` and `CRON_SECRET` are
  all set for Production *and* Preview, so branch pushes will build preview deployments
  without further setup. Until then, deploy with `npx vercel deploy --prod` from this
  folder.
- **Email does not send yet.** `RESEND_API_KEY` is a placeholder, and there is no
  verified sending domain on the Resend account. Responses still save — the routes log a
  failed send and return success on purpose — but no confirmation reaches the person and
  no alert reaches you. To finish it: verify a domain in Resend, create a sending key,
  then set `RESEND_API_KEY` and `FROM_EMAIL` in Vercel and redeploy.
- **The deployment is public.** Anyone with the URL can see it and submit the
  questionnaire. If you want it closed while the placeholders are still in, turn on
  Deployment Protection in the Vercel project settings.

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

The Tora House palette and typefaces, as supplied. Tokens are CSS custom properties in
`app/globals.css`, exposed to Tailwind through `@theme inline`. No raw hex belongs in a
component.

| Token          | Value     | Job                                          |
| -------------- | --------- | -------------------------------------------- |
| `--bone`       | `#F3EEE4` | Page background                              |
| `--ink`        | `#17211C` | Type on light; the primary dark ground       |
| `--vetiver`    | `#2C4034` | The second dark ground (the room)            |
| `--brass`      | `#A98448` | Rules, borders and large type only           |
| `--brass-deep` | `#7A5F2E` | Text under 24px on bone                      |
| `--sand`       | `#D9CDB4` | Alternating sections; secondary text on dark |

Two tokens are derived, because the sheet does not cover them: `--muted` (`#4F564E`) for
secondary text, and `--brass-text` (`#6A5228`) for brass text on sand, where the brand's
deep brass reaches only 3.81:1 and the application form lives. Every measured ratio is
listed on `/styleguide`.

Over the palette sits a semantic layer — `--surface`, `--fg`, `--fg-muted`, `--rule`,
`--link` — remapped by `.on-sand`, `.on-dark` and the print stylesheet, so one set of
components works on bone, sand, ink and vetiver.

**Typefaces:** Bodoni Moda for every display and heading, with its optical-size axis set
per step (96 at display, 48 at H2, 36 at statement, 24 at H3); Jost for body, UI and the
tracked eyebrows. Both through `next/font`. Eyebrows are set at 400 rather than the
brand's 300 — at 11px the 300 weight is too fragile to read — with the tracking kept.

**The mark:** `components/Brand.tsx` draws the torana as inline SVG in `currentColor`
and exports the three lockups. It drops the lower architrave below 32px and never closes
the gateway, as the brand sheet requires.

Motion is one pattern: fade in and rise 16px, 700ms, once, at 15% visibility, staggered
80ms (120ms between hero lines). The hiding class is added by JavaScript on mount, so a
visitor whose JS never runs sees the content rather than a blank page. Everything is
disabled under `prefers-reduced-motion: reduce`.

## Print

`@media print` in `app/globals.css` turns the page into a clean brochure: nav, forms,
waitlist and grain hidden, dark sections flipped onto paper, the grid collapsed to one
column, images kept, and a footer rule carrying the brand name and the application URL.
