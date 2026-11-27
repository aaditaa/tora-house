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

## The immersion launch, 19 November 2026

The brief that put High Tea and Pilates across the site was followed in its order and
its acceptance checks all pass. These are the places it was not followed to the letter,
and why.

**Where the build departs from the brief**

- **The button reads "Reserve a seat · ₹2,000", with a middle dot.** The brief wrote an
  em dash. Em dashes came out of every visible line on the site the day before, so the
  dot matches the rest of the page.
- **The panel is Ink, not Vetiver.** Brass type on Vetiver is 3.22:1 and fails; on Ink it
  is 4.79:1. The brief's Ink-or-Vetiver choice was made on contrast.
- **The bar is rendered on the server and never hidden on mount.** Hiding it on mount
  makes it flash for everyone who dismissed it. A small script that runs before the bar
  is parsed marks the page instead, so it is never painted for them. It sits over the
  cover rather than pushing it down, so it causes no layout shift.
- **The bar is on the home page only.** It links to `#immersion-one`, which exists only
  there. About, Privacy and Terms do not carry it.
- **Demo leaves the nav while the immersion is on sale.** The brief asked for that. It
  undoes, for three weeks, the earlier request to have Demo in the nav. The door to the
  demo stays in the Method section, and Demo returns to the nav when the event has run.
- **The invitation is a modal, and there is no mobile sticky footer.** The brief offered
  both and said to keep whichever does not make you wince. On a phone the nav's single
  item is already a sticky "Reserve a seat", so a footer would repeat it on every
  scroll. The modal, late and once, does not.
- **`nextImmersion`, `isUpcoming` and `seatsLeft` are functions, not values.** The first
  two depend on the time; the third reads the database and lives in `lib/seats.ts` so
  that the event file stays safe to load in the browser.
- **Seats left counts paid seats only.** Requests do not hold seats, so the count can
  never show a room as full on the strength of people who have not paid. The cost is
  that two people can request the last seat. PLACEHOLDERS.md section 9 has the detail.
- **A full room hands the page back to the waitlist.** The brief did not say what the
  hero, nav, bar and invitation should do at zero seats. Left alone they would have gone
  on offering a seat that was not there, so at zero they behave as they do after the
  event, while the section stays and says it is full.
- **The event object has two fields the brief did not list:** `copy`, so the section's
  words live with the event they describe, and `paymentUrl`, for the Razorpay link.
- **The time range keeps together.** Invisible word joiners sit either side of the en
  dash in "10–11am", so a narrow column can never leave "10–" on one line and "11am" on
  the next. Emails strip them.
- **No venue credit under the section, and no payment line under the button.** Both were
  built as the brief asked ("Hosted at Maison de Medusa, a Reformer Pilates studio and
  tea room in Whitefield ↗", and "Nothing is charged here. Payment is taken afterwards
  on Razorpay's page…") and both were taken out on 19 November 2026 at your request.
  The venue is still named in the lede, the details and the bar. The booking form no
  longer links to the privacy note, and the confirmation screen and email still say
  payment comes separately.

**Changes outside the new files**

- `components/form/Fields.tsx`: field underlines, focus lines and error text now use
  three new tokens that change on dark grounds. Before this, an error on the Ink panel
  was 2.24:1 and the underline 2.16:1. The waitlist on Bone looks exactly as it did.
- `lib/schemas.ts`: two existing error messages lost their em dashes.
- `components/Nav.tsx`: the gap between items on a tablet went from 28px to 20px.
  "Immersion" and "Reserve a seat" are longer than the items they replace, and at 768px
  the list otherwise wrapped. Desktop is unchanged.
- `components/Waitlist.tsx`: joining marks the session, so the invitation never asks
  someone who has just joined.

**Verified, 19 November 2026, against a local production build**

- Lighthouse, desktop, three runs each, before and after: performance 99/100/100 both
  times; accessibility, best practices and SEO 100 both times; CLS 0.000 on every run;
  median LCP 621ms before, 654ms after, which is run-to-run noise.
- Both sides of `isUpcoming`, by moving the date: every surface switches, and the API
  refuses a booking for a past event with a 409 before touching the database.
- Seat states at twelve, two left and zero, with the paid count stubbed.
- The lockup at 1440, 1280, 768 and 390, with and without a partner SVG.
- The invitation: not before 60% scroll and 45 seconds; exit intent only with a fine
  pointer and only past 60%; the focus trap both ways; Escape, scrim and close; the scroll
  lock; a 30-day dismissal per event; never twice a session; never after booking or
  joining.
- Dismissing the bar and the invitation, then reloading as a new visit: neither returns
  and the bar never reaches the page.
- `tsc`, `eslint` and `next build` clean. First load JS on the home page went from
  147 kB to 152 kB, almost all of it the booking form.

**Not verified**

- **A real booking end to end.** The `immersion_bookings` table was applied to the
  production database on 19 November 2026, but no booking has been written to it yet and
  no confirmation or notification email has been sent through Resend. Once the site is
  deployed, make one booking with a real address before sharing the link, then delete
  that row.
- **The partner's SVG.** Tested with a stand-in file of the right shape. Their real
  mark may need its colour set for Ink.

## The questionnaire came off the site, 22 November 2026

At your request the whole questionnaire went: the `#apply` section, `Application.tsx`,
`ApplicationSection.tsx` and `/api/apply`, plus everything only they used (the
application schema and steps, the applicant and notification emails,
`upsertApplication`, and the answer lists in `lib/config.ts`). The print footer now
points to `/#waitlist`, and the About page no longer promises a questionnaire "when it
comes". The `applications` table, its rows and the CSV export are untouched. The home
page's first load went from 152 kB to 148 kB.

The privacy note was rewritten the same day. It now covers the waitlist, immersion
bookings and the questionnaire answers still held, in that order; says that payment
happens on Razorpay's page; lists what the site keeps in the browser (the bar and
invitation dismissals, two session flags and the demo's invented data; no cookies, no
analytics); and says the rate limit counts network addresses in memory without storing
them. The old consent paragraph mentioned a research box that no longer exists; it now
says there are no pre-ticked boxes, which is true.

## Razorpay payment links, 26 November 2026

Each booking now gets its own Razorpay payment link for exactly its price (₹2,000
for one seat, ₹3,000 for two), shown as a Pay button the moment the request is in.
Seats are held for two hours while the link is open. Razorpay's webhook and the
return page both mark a booking paid, checking Razorpay's signature first, and the
emails go out once.

Departures and decisions:

- **Two seats is the most one booking can take**, because only two prices were given.
  The form previously allowed four.
- **Seats are held while a link is open.** Without that, two people could both pay
  for the last seat.
- **Razorpay also sends the link by email and text.** This site's own emails go out
  from Resend's shared test sender, which only delivers to the account owner, so
  Razorpay's message is the one a booker can be relied on to receive until the
  domain is verified in Resend.
- Migration 0003 adds six columns and one index to `immersion_bookings`. It was tested
  on a temporary Neon branch on 26 November 2026: the seat count with paid, held,
  lapsed and linkless bookings; marking paid twice (the second does nothing); the
  unique link index; and re-booking with a different number of seats.

Verified locally against a production build with stand-in secrets: the webhook
refuses a missing, forged, wrong-secret or altered signature and ignores other events;
the return page confirms only a genuine signature on a paid status; a three-seat
booking is refused; the seat picker, the button total and the Pay screen render as
described. **Not yet verified:** a real link from Razorpay and a real payment, which
need the keys.

### After the first live booking, 27 November 2026

- The Seats row reads "10 seats left", counting live, rather than the room size alone.
  At three or fewer it still spells the number out.
- The first live booking was a test. It is marked `test`, so the room still counts ten.
- The invitation now switches off the moment the booking form opens, for the rest of
  the visit. Before, it could open while someone was filling the form in, or in the
  second or two while their payment link was being made.
- The Pay step comes forward as its own card after booking, with the Pay button
  focused, and stays on the page beneath it if the card is closed. The invitation and
  the Pay card share one modal component, `components/Modal.tsx`.

## Meta Pixel and Conversions API, 27 November 2026

The pixel is on every page, for every visitor, with the journey sent as standard
events (PageView, ViewContent, InitiateCheckout, AddPaymentInfo, Purchase, Lead) and
the last three also sent from the server with matching event IDs. Asked whether to
gate it behind a consent bar, the answer was to load it for everyone; the privacy
note was rewritten to say so and no longer says "no cookies and no analytics".

- UTM tags are now kept from the landing page for the whole visit, with Meta's
  `fbclid`, so a visitor who reads About before booking still counts against the ad.
- A booking's `utm` column now also holds Meta's `fbp`/`fbc` identifiers.
- Nothing loads or sends until the pixel ID (and, for server events, the access
  token) are set in Vercel. Verified locally: the events fire in order with the
  right values and IDs, without contacting Meta. Not verified: Meta receiving them,
  which needs the real pixel ID and token.

## The ad landing page, /immersion-one, 28 November 2026

Built from the reference in `tora-house-landing-page.zip`, in this codebase's terms.
Where it departs from the reference:

- **Reserve is a two-field card, not a fixed payment link.** Name and email, then
  straight to the Razorpay link made for that booking, through the same API as the home
  form. A fixed link could not hold a seat, mark it paid or tell the pixel which booking
  paid. "Are you a member?" became optional in the API so this card can leave it out;
  the home form still asks it.
- **The pixel follows the home page's sequence:** PageView, ViewContent on landing,
  InitiateCheckout when a Reserve button opens the card, AddPaymentInfo (paired with the
  server's) when the booking is in, Purchase on the page Razorpay returns to. The
  reference fired Lead on the contact, map and waitlist links; that would have counted
  clicks as sign-ups, so those send Contact and FindLocation instead, and Lead stays a
  real waitlist join.
- **Fonts:** Bodoni with its optical-size axis and Jost 500 load on this page only, so
  the rest of the site keeps its current cut. Bodoni is set at opsz 14, weight 550.
- **Copy:** three em dashes became commas, per the site's rule. The mats and refund
  answers were stated as facts in the reference; the brief lists both as unconfirmed,
  so they are pink placeholders with the teacher's name.
- **Additions:** a Privacy link in the footer (the page runs the pixel); a link to the
  page from the home immersion section; the page in the sitemap; a deep link,
  `/immersion-one#reserve-2`, that opens the card for two.
- **Not used:** `studio.jpg` and `room.jpg` from the zip; the reference page does not
  use them either.
- If the room fills, or the morning has passed, the Reserve buttons give way to the
  waitlist on their own.

Verified at 390px: no sideways scroll; the bar's Reserve button on screen from the
first view; the video autoplays muted and inline; every link resolves. Lighthouse
mobile on a production build, three runs: performance 91, 92, 93; accessibility, best
practices and SEO 100; CLS 0. The home page with its new link: 99 mobile.

### The one-pager is the home page's immersion section

The home page's High Tea and Pilates section is now the whole one-pager, in place:
the lockup, the film, the facts, both reserve buttons, the six cards, the questions
and the closing call, edge to edge on Ink. `components/immersion-one/OnePager.tsx`
renders both it and `/immersion-one`, so the two cannot drift. On the home page it
leaves out the page's own header, footer and bar, and its film loads only as it
comes near. The bar and the nav scroll to it; every Reserve opens the booking card
in place. The old home section, its long booking form and its "10 seats left" row
are gone: the one-pager states the room size ("Ten women, 40 to 60"), as the brief
asks, rather than counting seats down.

The page's separate Bodoni (with its optical-size axis) and Jost 500 were dropped.
They shared their family names with the site's fonts, so every page downloaded both
sets. The one-pager now uses the site's Bodoni at weight 550 (the default cut, opsz
11, close to the brief's 14) and the site's Jost, which is now one variable file
carrying every weight, including the labels' 500. Measured locally, live code
against new, both with the pixel: the home page downloads 1165 KB against 1159 KB
and scores 95/92/91 against 98/95/93 on mobile; `/immersion-one` scores 96.
