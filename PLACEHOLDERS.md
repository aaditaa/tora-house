# Placeholders

Everything the brief did not supply is in this file. Nothing below has been invented —
each one renders as a visible `{{...}}` marker on the page until it is filled in.

**This file is the gate.** A page carrying a real cohort number and a real closing date
converts differently from one carrying "limited seats", and that difference is the whole
argument of the founding-cohort section. Clear this list before sharing the link widely.

---

## 1. The four from Section 1 of the brief — all in one file

These were left unfilled in the brief. They all live in [`lib/config.ts`](lib/config.ts)
and nowhere else; change them there and the whole site follows.

| Marker               | File                  | Line | What is needed                                                                                                                                                                                                       |
| -------------------- | --------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~`{{BRAND_NAME}}`~~ | —                     | —    | **Resolved: Tora House.** Wordmark, torana mark and tagline are in `components/Brand.tsx`; the palette and typefaces are in `app/globals.css`.                                                                       |
| `{{COHORT_SIZE}}`    | `lib/config.ts`       | 11   | The real founding cohort number, as a number (e.g. `42`). Renders as the largest single element on the page. Set it to `null` only while it is genuinely unknown.                                                    |
| `{{CLOSE_DATE}}`     | `lib/config.ts`       | 17   | The real date applications close, as `"YYYY-MM-DD"`. This single value drives `isCohortOpen()`, the nav and hero CTAs, the application section and the prominence of the waitlist. Treated as end-of-day India time. |
| `NOTIFY_EMAIL`       | `.env.local` / Vercel | —    | Where application alerts and the waitlist digest go. An environment variable, not source.                                                                                                                            |

## 2. Public contact details

| Marker                      | File            | Line | What is needed                                                                                                                                                                            |
| --------------------------- | --------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{TBD}}` — `CONTACT_EMAIL` | `lib/config.ts` | 64   | The public address. Used in the footer, in both legal pages, and as the mailto fallback a woman is offered if the form fails on submit — so it must be an address someone actually reads. |
| `{{TBD}}` — `GUIDE_NAME`    | `lib/config.ts` | 69   | The named lead guide. Signs the applicant confirmation email and the waitlist email, both of which are written to read as though a person sent them.                                      |

## 2a. The page does not say who it is not for

Three exclusions came off this page: "Who it is not for" on 28 October, the FAQ with
it, and the room's "Performance athletes are not admitted" on 30 October. A single
replacement sentence went under "Who this is for" the same day and was taken out again
within the hour, deliberately. The position is settled: **the page says only who it is
for.**

The questionnaire still filters on age, so the exclusion is enforced — it is simply
never stated, and a woman training for an event finds out after ten minutes of
answering rather than before she starts. That is a known trade, not an oversight.
If it is ever reversed, the sentence that was tried was:

> Performance athletes are not admitted — if you are training for an event, this is
> the wrong room.

## 2b. The cover photograph is too small for what it is asked to do

`cover.jpg` is **675 × 1200**. It is the full-bleed ground of the first screen, so on a
1440px display it is stretched to roughly twice its width, and on a 2560px display to
nearly four times. That is why it reads soft, and no compression setting changes it —
the pixels are not there.

A `quality: 65` override on this slot briefly made it worse and was removed on 30
October; at AVIF sizes the full-quality render is 84 KB against the 153 KB this image
cost before AVIF, so there was nothing to buy by compressing it harder.

**The fix is a larger file.** For a frame that runs edge to edge behind type, 2560px on
the long edge is the minimum and 3200px is safer. Drop it into `/public/images/` under
the same name and rebuild — nothing else needs to change.

## 3. Three claims the page no longer makes at all

No `{{TBD}}` marker is left anywhere in the method or the FAQ — the FAQ because it was
deleted on 28 October 2026, the method because its one marker was deleted the same day.
These three answers are no longer placeholders, because the sentences that asked for
them are gone from the markup. That is a stronger decision than leaving a marker and
it should be made on purpose rather than inherited from a diff:

- **What "vetted" means.** The standard section still says every practitioner is
  "certified, contracted and checked", and the sentence that promised to state that
  standard in full has been removed. The adjective now stands unsupported. Three
  words doing the work of a standard is the kind of claim a member will test on her
  first referral, so either the standard goes back on the page or the three words
  should soften to what can be shown.
- **The price.** The page asks a woman to spend ten minutes on a questionnaire without
  naming a figure or saying where one will be named. The old FAQ wording at least said
  the number was held for the call afterwards. If that is still the intention, the
  sentence belongs somewhere on the page.
- **The weekly time commitment.** Nothing now tells her what a week costs her in hours.
  The questionnaire asks how much time she has; the page no longer says how much it
  wants.

The remaining markers are all in `lib/config.ts` and the two legal pages, listed above
and below.

## 3a. What the last question stopped doing on 28 October 2026

The last step now asks for an email address (required), a phone number (optional) and
one unticked checkbox, "I'm interested to hear more about this". It replaced a
four-option multi-select that was carrying three jobs at once, and all three were lost
rather than moved. This is the record of what went with it.

- **The anonymous exit.** The fourth option was "Nothing for now, I just wanted to
  answer", and it was there so the other three meant something: without an easy exit a
  polite respondent ticks the first box out of courtesy and you have learned nothing
  from her having ticked it. Every submission now carries contact details, so
  everything you read from here on is from someone who was willing to be contacted —
  which is a different population from the one the earlier answers came from. Do not
  compare response rates across that line.
- **The research-call ask.** "I'm happy to have a twenty-minute conversation about
  this" set `research_optin`, and that column was the interview pipeline. Nothing sets
  it now. `hear_more` is the nearest thing and it is weaker: it says she is interested,
  not that she has agreed to sit on a call. If the interviews matter, the ask has to go
  back somewhere.
- **The waitlist route out of the questionnaire.** "I'd like to be on the waitlist for
  a later cohort or another city" was how someone outside the first cohort stayed in
  touch from inside the form. The waitlist section lower down the page still exists and
  still works, but a woman who finishes the questionnaire is no longer offered it, and
  nothing on the confirmation screen points her to it.

Two rows written before the change are still in `applications`, one of them with a null
email. They are why `email` is nullable in the schema and why `next_steps`,
`research_optin` and `consent_contact` have not been dropped. The README has the SQL.

No name is collected, so the confirmation email opens without a salutation rather than
guessing one from the address.

## 3b. One consent decision worth revisiting

The waitlist no longer has a consent checkbox; joining is the consent, with a line
beside the button saying what joining means. That is a weaker form than the ticked box
the DPDP Act prefers, and it is a deliberate trade for a shorter form. If a lawyer
reviews one thing on this site, make it that line and the privacy note it links to.

The questionnaire still has its explicit, unticked consent box. That one should stay.

## 4. Legal pages

Both pages are written, specific and in the site's own type system. These gaps are the
facts only you have.

| Marker    | File                   | Line | What is needed                                                                                                     |
| --------- | ---------------------- | ---- | ------------------------------------------------------------------------------------------------------------------ |
| `{{TBD}}` | `app/privacy/page.tsx` | 18   | Date the privacy note was last updated. It was rewritten on 22 November 2026.                                      |
| `{{TBD}}` | `app/privacy/page.tsx` | 64   | What Maison de Medusa receives about a booking: for example names and food lines, the seat count only, or nothing. |
| `{{TBD}}` | `app/privacy/page.tsx` | 138  | How many named individuals can read what the forms collect.                                                        |
| `{{TBD}}` | `app/privacy/page.tsx` | 153  | How long questionnaire answers are kept after a cohort closes.                                                     |
| `{{TBD}}` | `app/privacy/page.tsx` | 155  | How long immersion bookings are kept after the session.                                                            |
| `{{TBD}}` | `app/privacy/page.tsx` | 170  | Working days to action a deletion or access request.                                                               |
| `{{TBD}}` | `app/privacy/page.tsx` | 180  | Registered entity name and address (the data fiduciary).                                                           |
| `{{TBD}}` | `app/terms/page.tsx`   | 16   | Date the terms were last updated.                                                                                  |
| `{{TBD}}` | `app/terms/page.tsx`   | 39   | Where the membership agreement lives, and its headline terms.                                                      |
| `{{TBD}}` | `app/terms/page.tsx`   | 57   | Registered entity, address and jurisdiction.                                                                       |

The privacy note names Neon, Resend and Vercel as processors. If you swap any of them,
that sentence has to change with it.

## 5. The brand mark — resolved

The torana is drawn as inline SVG in `components/Brand.tsx` (`ToranaMark`) in
`currentColor`, so it reverses onto any ground without a second asset. The brand rules
are honoured in code: clear space of one quarter the mark's width, the lower architrave
dropped below 32px via the `compact` prop, and the gateway never closed.
`app/icon.svg` is the seal — bone mark on an ink circle.

Still to add: `app/apple-icon.png` at 180×180, exported from the seal.

---

## 6. Photography — stand-ins are in place, the real shoot is not

All six slots are filled with the photography supplied alongside the brand assets,
cropped to each slot's ratio. **These are stand-ins.** Each was cropped specifically to
exclude the headline type another brand had set over it, so re-cropping them differently
will bring that type back into frame.

Two things still have to happen before launch:

1. **Licensing.** Confirm every frame is licensed for this use, or replace it. Nothing
   here may be used on a public site on the strength of having been downloaded.
2. **Casting.** The stand-ins do not meet the casting brief below. Only two of the nine
   show a woman in the 40–60 range, and none is an Indian woman shot in an Indian space.
   That gap is the single most expensive thing left on this list — see why below.

   **It widened on 30 October 2026.** Three frames were added that day: `sound`, which
   has no people in it and is fine, and `strength` and `chapter`, which both show women
   who read as well under forty. The page now argues in words that it is built for women
   between forty and sixty while showing four of them in a park who are not, directly
   beneath a heading about the room they are supposed to be in. That is the exact failure
   the casting note below describes, and it is now on three sections rather than one.

Replacing one is a one-file operation: drop a correctly named file into
`/public/images/` at the stated ratio and rebuild. The slots, filenames, ratios, subject
notes and alt text are all in
[`public/images/manifest.ts`](public/images/manifest.ts); alt text must be updated to
match whatever replaces the stand-in. Image URLs carry a token derived from the file
itself, so replacing one under the same name will not leave browsers serving the old one.

| Slug          | File              | Ratio | Where it appears               |
| ------------- | ----------------- | ----- | ------------------------------ |
| `cover`       | `cover.jpg`       | 9:16  | The cover screen, as a ground  |
| `hero`        | `hero.jpg`        | 4:5   | Hero                           |
| `baseline`    | `baseline.jpg`    | 5:8   | It starts with facts           |
| `practice`    | `practice.jpg`    | 2:3   | The method, first pillar       |
| `generations` | `generations.jpg` | 8:7   | The method, beside the opening |
| `room`        | `room.jpg`        | 2:3   | The room                       |
| `strength`    | `strength.webp`   | 2:3   | The method, one curriculum     |
| `sound`       | `sound.webp`      | 2:3   | One guide                      |
| `chapter`     | `chapter.webp`    | 3:4   | The room                       |

**Every slot holds a whole source frame**, not a crop of one — between 98% and 100%
of each original, with only a few pixels trimmed to reach a clean ratio.

> **Four of these five were edited, and you should know exactly how.**
> The stand-ins carried another brand's campaign lines across them — "LET'S TALK
> ANTI-AGING WELL-AGING", "A pause that brings you back to yourself", "waiting to feel
> energised?", "ART of SELF CARE". Cropping above or below that type was what made
> every image look so tightly zoomed, so the type was painted out instead: the glyphs
> masked, inpainted with Telea and Navier-Stokes averaged together, and real texture
> lifted from clean parts of the same frame laid back over the repair. At full
> resolution the mended areas are soft if you look for them; the page shows each frame
> at roughly half its native width, so they do not read. `room.jpg` is untouched — it
> never carried type.
>
> **Removing a campaign line does not make a photograph ours.** These are still someone
> else's pictures, still stand-ins, and still have to be licensed or replaced before
> this page goes anywhere public. Editing them raises the stakes rather than lowering
> them, and the fact that they now look like they belong to this brand is exactly why
> that is easy to forget.

Two things this means for the real shoot:

- **Shoot wider than these.** Even whole, every stand-in is a close frame. The page has
  room for scenes — a room with people in it, a figure with air around it — and the
  sky frame is the only one that delivers that.
- **Shoot bigger.** Nothing here is above 1531px on its long edge, which is why the
  room image sits upright in the grid rather than running full width. At 2400px or
  more, that section can go edge-to-edge as originally drawn.

### Casting — the one that matters

**Every image showing a person must show a woman between 40 and 60.** Visibly: grey
hair present and not hidden, real bodies, Indian women predominantly, shot in Indian
spaces.

The visual language of premium wellness is almost entirely women under thirty-five, and
a reference set assembled from it will inherit that by default. A forty-eight-year-old
who lands on a page full of twenty-eight-year-olds concludes within two seconds that it
is not for her — and the exclusion that "Who this is for" states in words is undone by
the photography above it. This is a hard casting brief.

### Art direction

- **Light.** Low-angle golden light or soft diffused window light. Never flash, never
  overhead fluorescent, never a bright white studio. Shadow is welcome: a figure half in
  shadow reads as considered, a fully-lit figure reads as a brochure.
- **Colour in camera, not in post.** Linen, raw wood, brass, unbleached cotton, sage
  walls, terracotta. Avoid cool blues, chrome, black rubber flooring and anything that
  looks like gym equipment.
- **Composition.** Architectural framing — shoot through a doorway, a column, a window.
  Subjects off-centre with real negative space for type. Wide and atmospheric for the
  hero and the room; close and quiet for the baseline and practice frames. Faces often
  turned away or partly obscured: this is a membership, not a testimonial.
- **Motion over pose.** Where there is movement, let it blur slightly. A posed asana
  held for the camera is the single thing that will make this look like every other
  wellness site.
- **Texture.** Fine grain applied consistently across the whole set, so the page reads
  as one shoot rather than a stock assembly.
- **The register to resist.** Resort luxury — infinity pools, champagne, marble, sunset
  terraces — is adjacent to this and wrong for it. That sells a holiday. This sells a
  practice held over a year: the first is empty and beautiful, the second has people
  doing something in it.

The `room` frame carries overlaid type in its lower-left quarter. Keep that quarter
quiet.

---

## 7. Generated imagery — five files, all synthetic

Five assets were generated with an image/video model on 7 November 2026 and are
placeholders exactly as the photography above is. Four are in the demo; the fifth
is on the marketing page's cover.

| File                                      | What it is                                           | Where it appears                               |
| ----------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| `public/video/cover.mp4`                  | Light drifting across a green plaster wall and lotus | **The marketing page's cover**, over the still |
| `public/video/jaali.mp4`                  | Brass light moving across a carved jaali screen      | Behind the lockup on the welcome screen        |
| `public/images/immersions/high-tea.jpg`   | Brass teapot, porcelain cups, raw silk               | The high tea immersion                         |
| `public/images/immersions/sound.jpg`      | Ripples in a green stone basin, brass bowl rim       | The sound meditation immersion                 |
| `public/images/immersions/pickleball.jpg` | Court lines on a sand surface, a paddle at the edge  | The pickleball meet                            |

What is true about them:

- **They contain no people**, deliberately. A generated face would be a invented
  member, and the rule against stock-photo stand-ins of real people applies here
  with more force, not less.
- **They are abstract, not documentary.** None of them is a photograph of a Tora
  House event, because no Tora House event has happened. If an immersion is ever
  described to a prospective member using one of these frames, that is a
  misrepresentation — replace them with photographs of the real room first.
- **Check the model's licence terms before any public or commercial use.** Being
  able to generate an image is not the same as being cleared to publish it.
- `jaali.mp4` was re-encoded on 7 November 2026 and is now **510 KB**, down from
  9.4 MB. The model returned 768×1344 at 11.7 Mbps with a 194 kbps audio track;
  the element is muted and `aria-hidden`, and the film is shown in a 4:3 box
  under `object-fit: cover`, so the audio was dropped and the frame cropped to
  the 768×576 that is actually visible before encoding at CRF 24. Measured SSIM
  against the original is **0.975**. It is still loaded lazily, never
  preloaded, and skipped entirely under `prefers-reduced-motion`.

- `cover.mp4` is **533 KB**, compressed from 4.7 MB the same way, SSIM 0.977. It
  lies **over** `cover.jpg` rather than replacing it, so the photograph is still
  what shows on a slow connection, under `prefers-reduced-motion`, or if autoplay
  is refused. The cover scrim was re-measured against it: the brightest frame
  behind "Begin" gave 3.43:1 before a bottom gradient was added, 5.86:1 after.

## 8. One photograph is deliberately unused

`public/images/hero.jpg` is on no page, and that is a decision rather than an
oversight. The hero was restructured on 7 November 2026 to put the four parts of
the membership above the fold, a second large photograph one screen below the
cover pushed them off it, and on 7 November it was settled that it stays out.

The file and its manifest entry are both still in place. Nothing references them,
so they cost nothing at runtime — but if the picture is wanted again, the Problem
and Baseline sections are the obvious homes, and if it is never wanted, both can
be deleted together.

---

## 9. The first immersion: High Tea and Pilates, Saturday 5 December

Everything about the event lives in one object in
[`lib/immersions.ts`](lib/immersions.ts). The announcement bar, the hero line, the nav,
the invitation and the section all read from it. Change a value there and every place
follows.

**One of these is a hard gate:** the partner's name and mark should not go public until
they have agreed in writing. The bookings table is already in production.

| What                          | Where                                                    | What is needed                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~The migration~~             | `drizzle/0002_amusing_umar.sql`                          | **Done, 19 November 2026.** Applied to the production `tora_house` database after testing on a temporary Neon branch (insert, update-on-repeat, paid count). It added the `immersion_bookings` table and nothing else; `applications` and `waitlist` were not touched.                                                                                                                   |
| **The partner's agreement**   | —                                                        | Written agreement from Maison de Medusa to their name beside ours ("Tora House × Maison de Medusa", in the bar and the lockup), their venue named as the place it happens, and their mark in the lockup once they supply it.                                                                                                                                                             |
| ~~`{{SEATS}}`~~               | `lib/immersions.ts`, line 46                             | **Set: 10 seats** (19 November 2026). The Seats row shows "10" and the body reads "Ten women". The page says "Three seats left" only when three are actually left, and "Full" at zero; a full room takes Reserve off the hero, nav, bar and invitation by itself.                                                                                                                        |
| The full inclusions list      | `lib/immersions.ts`, line 51                             | Three items are listed, all from the brief: the Pilates, the high tea tasting, the conversation. If anything else is included (a mat, what to wear, parking, the teas themselves), add it. Nothing has been invented to fill the list.                                                                                                                                                   |
| The partner's mark            | `public/partners/maison-de-medusa.svg`                   | A vector file **supplied by Maison de Medusa**, not taken from their website (their site's PNG is not to be hotlinked, downloaded or upscaled). One colour, light enough to read on Ink: Bone or Brass. It renders 184px wide. Until the file exists the lockup sets their name in Bodoni italic, which is a finished look rather than a gap. Drop the file in and rebuild.              |
| **Razorpay keys and webhook** | Vercel environment variables, and the Razorpay dashboard | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` (test keys for Preview, live keys for Production), and a webhook at `https://thetorahouse.in/api/razorpay/webhook` for the `payment_link.paid` event. Until the keys are set, each booking is saved with no payment link and the confirmation says the link follows by email. No card field is ever on this site. |

### How a booking becomes a seat

- Prices are in the event object: `prices: [2000, 3000]`, so ₹2,000 for one seat and
  ₹3,000 for two. Its length is the most one booking can take, so a booking is two
  seats at most. Add a third price to allow three.
- A request writes a row to `immersion_bookings` with `status = 'requested'` and the
  amount, then asks Razorpay for a payment link for exactly that amount, with her name,
  email and number filled in. She sees a Pay button at once; the link is also in her
  confirmation email, and Razorpay emails it (and texts it, if she gave a number).
- **The link holds her seats for two hours**, or until the session starts if that is
  sooner. A seat counts as taken if it is paid, or held by a link that is still open.
  When an unpaid link lapses, its seats are free again. Booking again before paying
  hands back the same link, unless the number of seats changed, in which case the old
  link is closed and a new one made.
- **Paid is automatic.** Razorpay's webhook marks the booking paid; so does her return
  to `/booking/paid`, which checks Razorpay's signature first. Whichever comes first
  records it, and she gets a confirmation and you get a "Paid" email, once.
- A booking marked `test` keeps its record and payment but never counts against the
  room, and a late message from Razorpay cannot turn it back into a paid one. The
  first live test booking, on 26 November 2026, is marked this way.
- Two people can still, rarely, take the last place in the same moment. If a payment
  takes the room over its size, the "Paid" email says so and says to refund one from
  the Razorpay dashboard.
- The page re-renders hourly, so a seat count on the page can be up to an hour behind.
  The booking API checks the live count on every request.
- If Razorpay is not set up or refuses, the booking is still saved, the confirmation
  says the link follows by email, and your notification carries the line to mark it
  paid by hand.

### What the page will not say

No teacher's name, no tea list and no urgency language appear anywhere until they are
real. When they are, the teacher and the teas belong in `copy` and
`includes` in the same object.

### After 5 December

Nothing needs editing. At 10am IST on the day the bar disappears and bookings close.
Within the hour, as the page re-renders, the hero goes back to "Join the waitlist" with
"Read the method", the nav brings Demo back, the invitation offers the waitlist alone,
and the section shows the event as held. To keep the waitlist
as the lead ask even before the event, change `LEAD_WITH` on line 74 to `"waitlist"`.

---

## 10. The questionnaire is off the site (22 November 2026)

Removed: the questionnaire section (`#apply`), its form, and the `/api/apply` route,
along with its two emails, its database write and its answer lists. On the page, the
waitlist is now the way in, alongside the immersion booking. The questions themselves
now belong to the guide's call.

Kept on purpose:

- **The `applications` table and every row already in it.** Nothing was deleted from the
  database. `/api/export?table=applications` still downloads them.
- **The privacy note's account of the questionnaire.** It now reads in the past tense: the
  questionnaire is gone, but the answers it collected are still held and still covered.

**The privacy note was rewritten the same day** to cover immersion bookings (what the
form collects, what it is used for, Razorpay taking payment on its own page), what the
site keeps in the browser, and the in-memory rate limit. Two facts only you have are
left as markers: what Maison de Medusa receives about a booking, and how long bookings
are kept.

What this changes elsewhere in this file: section 2a's point that the questionnaire
filters on age no longer holds, since nothing on the site filters on age now, and
sections 3a and 3b's notes on the questionnaire are history. An old link to `/#apply`
lands at the top of the page.
