# Build notes

Where this build departs from the brief, or could not verify something it asks for.
Nothing here was substituted silently.

## The four Section 1 placeholders arrived unfilled

`{{BRAND_NAME}}`, `{{COHORT_SIZE}}`, `{{CLOSE_DATE}}` and `{{NOTIFY_EMAIL}}` were still
markers when the brief was handed over. Rather than invent a name, a number or a date,
all four are driven from one place — `lib/config.ts`, plus one environment variable —
and render as visible markers. `COHORT_SIZE` and `COHORT_CLOSE_DATE` are typed
`number | null` and `string | null`; `null` means "not known yet" and the page says so
instead of guessing. See PLACEHOLDERS.md.

## Two brief-specified tokens fail the brief's own contrast bar

The palette and the "text contrast at least 4.5:1" requirement conflict. Measured:

- `--clay` (#A9654A) on `--bone` → **4.09:1**
- `--sage` (#7F8C7A) on `--bone` → **3.20:1**
- `--muted` (#6F655C) on `--linen` → **3.97:1** (on `--sand` it is 4.56:1, which passes)

The brief says to darken the token rather than ship it failing. I did not change the
named tokens, because `--clay` is the brand accent and is correct as a rule and focus
ring, where 3:1 is the bar and it passes. Instead there are three deepened variants used
wherever the colour carries text: `--clay-deep` (5.75:1), `--sage-deep` (5.27:1) and
`--muted-deep` (4.64:1 on linen). All ratios are listed in `/styleguide`.

If you would rather have one clay, replace `--clay` with `#8E4F37` and delete
`--clay-deep`; nothing else needs touching.

## `onConflictDoUpdate` cannot express `on conflict (lower(email))`

The brief specifies unique indexes on `lower(email)` **and** handling resubmission with
drizzle's `onConflictDoUpdate`. In drizzle-orm 0.45 that builder escapes its conflict
target as a column identifier, so an expression target is impossible — it throws.

I kept the index as specified, because it is a real database-level guarantee, and wrote
the two upserts out as SQL in `db/queries.ts`. They use `returning id, (xmax <> 0)` to
tell an insert from an update, which is what lets the route say "your details are
already in" rather than showing an error.

## Environment validation runs at server start, not at module load

A `throw` at module load in `lib/env.ts` would break `next build` on any machine without
secrets, which would make the marketing page unbuildable and CI unusable. Instead
`instrumentation.ts` validates once when the server starts: in production it refuses to
boot and names every variable that is wrong; in development it prints the same list as a
warning and keeps running, so the page can be worked on without a database to hand.
Verified — production genuinely refuses to start.

For the same reason the Drizzle client is a lazily-created, cached singleton rather than
one constructed at module load. It is still one client per process, not one per request.

## The hero is a two-column split, not full-bleed

The brief lists a 3:2 hero, "wide and atmospheric", and separately offers full-bleed as
one of several alternating layouts. I used type in a six-column well with the photograph
in the five columns beside it, because until real photography lands the hero slot has to
render its own subject note, and that reads badly under overlaid display type. The
full-bleed treatment with the soft `--umber` scrim — the one gradient on the site — is
used in The Room, where the brief specified it.

## `public/images/manifest.ts` is publicly served

The brief asks for the manifest inside `/public/images/`. Next serves everything there as
a static file, so the manifest is downloadable at `/images/manifest.ts`. It contains only
alt text, ratios and subject notes, so nothing is exposed — but it is worth knowing.
Moving it to `lib/images.ts` would fix that and change one import.

## The mailto fallback uses the public contact address

The brief asks for a mailto fallback to `{{NOTIFY_EMAIL}}` if a submission fails.
`NOTIFY_EMAIL` is server-only in the brief's own environment list, and exposing it would
need a `NEXT_PUBLIC_` variable. The fallback uses `CONTACT_EMAIL` from `lib/config.ts`
instead — the address already printed in the footer and both legal pages.

## The waitlist digest needs a scheduler

"Notify as a daily digest" needs something to call it. `vercel.json` registers a cron at
02:30 UTC (08:00 IST) against `/api/waitlist/digest`, authenticated with a bearer token
checked against `EXPORT_TOKEN`. The brief's environment list has no `CRON_SECRET`, so the
README says to set `CRON_SECRET` to the same value in Vercel rather than adding a seventh
variable.

## `isCohortOpen` is a function

The brief says to derive "a single `isCohortOpen` boolean". A module-level constant would
be evaluated once when the server starts and a long-running instance would never flip. It
is a function derived from the one date, called in the three places named, and the page
carries `revalidate = 3600` so a live site flips within an hour of the deadline without a
deploy. Both states were tested by moving the date.

## Next.js 15, as asked

Next 16 is current. The brief says 15, so this is 15.5.28 with React 19.

## A bug worth recording

React flushes click events synchronously. Reusing one `<button>` for both "Continue" and
"Send application" meant that advancing into step three changed that same element's
`type` from `button` to `submit` _during_ the browser's handling of the click that
advanced it — so the form submitted itself and step three appeared pre-populated with
validation errors. Fixed with distinct React keys on the two buttons, plus a guard that
treats a submit on an earlier step as "continue" (which also makes Enter behave).

## What was verified, and what was not

Verified locally against a production build:

- `npm run build`, `tsc --noEmit` and `eslint .` all clean; no console output in
  production bundles.
- No horizontal overflow at 390, 768, 1024, 1440 and 1920px; the hero headline is exactly
  two lines at every one of them.
- 35 distinct colour / background / size pairs on the page, every one at or above its
  WCAG threshold.
- Every form control has an accessible name; the two honeypots are the only non-tabbable
  controls; one `h1`, no heading-level jumps; one polite live region; step changes move
  focus to the new step heading.
- Form behaviour: per-field validation on blur, per-step validation on advance, no step
  skipping, sessionStorage draft persistence, the server-failure path keeping every answer
  and offering the mailto fallback.
- API: 422 on invalid input, a plain `{ ok: true }` with no write for a filled honeypot or
  a sub-four-second submission, 429 on the sixth request in an hour, 401 on the export and
  digest routes without a token, 400 on an unknown table.
- Open and closed cohort states, both driven from the single date.
- The OG image renders at 1200×630 in the display serif on `--umber`.

**Not verified**, and worth doing before launch:

- **Lighthouse.** It could not be run here. Run it against the deployed URL. The
  groundwork is in place — `next/font` with `display: swap` and metric-matched fallbacks,
  images lazy except the hero, no component or animation library, 103 kB shared JS — but
  the 95+/100 numbers are unconfirmed.
- **The live data path.** There is no Neon project or Resend account yet, so the actual
  insert, the upsert-on-resubmission and all four emails have never run against live
  services. Create the Neon `dev` branch, run the migration and send one real test
  application before sharing the link.
- **Print output.** The `@media print` rules are present in the built stylesheet and the
  elements they target exist, but no PDF was rendered. Print the page once.
- **A real phone.** The brief's own follow-up is right: send the deployed link to two
  women in the target age band and watch where they hesitate. The step-two textareas are
  where people drop.
