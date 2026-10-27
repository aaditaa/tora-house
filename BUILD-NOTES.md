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

## The palette, and what the brand sheet does not reach

The Tora House sheet gives six colours and two rules: brass carries rules, borders
and large type only, and deep brass is for anything set under 24px on bone. Both are
honoured. Two things the sheet does not cover had to be derived, and both are measured:

- **`--muted` (`#4F564E`)** — secondary text. 6.55:1 on bone, 4.81:1 on sand.
- **`--brass-text` (`#6A5228`)** — brass text on sand. The brand's deep brass reaches
  5.18:1 on bone but only 3.81:1 on sand, and the application form sits on sand.

Brass itself cannot carry text on either ground: 2.99:1 on bone, 2.22:1 on sand even at
full strength. It is used only for rules, borders and the hairlines, which is what the
sheet says it is for.

Every ratio is listed on `/styleguide`.

## Three things the contrast sweep changed

Re-running the sweep against the Tora House palette surfaced two real problems and one
cosmetic one. All three are fixed.

1. **The form field underline was a UI component at 1.51:1.** A hairline in brass at 55%
   on sand was the only thing marking where an input was — which makes it a component
   boundary owing 3:1, not decoration. Brass cannot reach 3:1 on sand at any mix, so the
   underline is now `--muted` (4.81:1 on sand, 6.55:1 on bone). Focus moves it to
   `--ink` and invalid to `--brass-text`, so all three states differ by colour rather
   than by weight and nothing shifts position on focus.
2. **The hairlines were effectively invisible** at 42% brass (1.51:1). Raised to 65% on
   bone and 80% on sand. They remain decorative — brass tops out at 2.99:1 on bone, and
   that is the brand's own ceiling, not something to design around.
3. The checkbox and radio borders were already fine at 4.81:1.

## Bodoni is wider than the scale was drawn for

The type scale in the brief was written for a different face. Bodoni Moda sets
appreciably wider, and swapping it in broke the hero headline in two places at once:

- At 390px, "A year of practice," needs 357px against the 342px a phone offers, so it
  wrapped to three lines. The display clamp minimum is now 2.5rem rather than 2.75rem,
  which brings it to 324px.
- From 1024px up, the same line needs up to 681px and the six-column text well offered
  540px, so it wrapped there too. The hero now gives the display line a row of its own
  across ten columns, with the lede and the photograph sharing the row beneath it.

The headline is two lines at 390, 768, 1024, 1440 and 1920 — measured, not eyeballed.

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
- Text contrast: 34 to 38 distinct colour / background / size / weight pairs per width on
  the home page, plus the privacy, terms and styleguide pages, and the application form
  with errors forced on all three steps. No failure anywhere. The two elements excluded
  are the headline and eyebrow sitting over the image scrim, which composite against a
  gradient rather than a flat colour; both are bone over an ink scrim at 80% or more.
- Non-text UI at or above 3:1: field underlines, radios and checkboxes all 4.81:1.
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
