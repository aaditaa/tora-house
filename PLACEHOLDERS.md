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

| Marker                         | File            | Line | What is needed                                                                                                                                                                            |
| ------------------------------ | --------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{TBD}}` — `CONTACT_EMAIL`    | `lib/config.ts` | 64   | The public address. Used in the footer, in both legal pages, and as the mailto fallback a woman is offered if the form fails on submit — so it must be an address someone actually reads. |
| `{{TBD}}` — `INSTAGRAM_HANDLE` | `lib/config.ts` | 65   | The handle. Also set `INSTAGRAM_URL` (line 66) to the full URL; while it is `null` the footer prints the handle as plain text rather than a dead link.                                    |
| `{{TBD}}` — `GUIDE_NAME`       | `lib/config.ts` | 69   | The named lead guide. Signs the applicant confirmation email and the waitlist email, both of which are written to read as though a person sent them.                                      |

## 3. Claims that need a real answer before they are published

| Marker    | File                    | Line | What is needed                                                                                                                                                                       |
| --------- | ----------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{{TBD}}` | `components/Method.tsx` | 91   | What "vetted" actually means: the certification, the contract and the check each practitioner passes. State the standard, not the adjective.                                         |
| `{{TBD}}` | `components/Faq.tsx`    | 44   | The honest weekly time commitment, e.g. "three to four hours".                                                                                                                       |
| `{{TBD}}` | `components/Faq.tsx`    | 68   | The price. If it is deliberately held for the application call, the sentence around it already says so honestly — but the figure still has to exist somewhere before the first call. |

## 4. Legal pages

Both pages are written, specific and in the site's own type system. These gaps are the
facts only you have.

| Marker    | File                   | Line | What is needed                                                |
| --------- | ---------------------- | ---- | ------------------------------------------------------------- |
| `{{TBD}}` | `app/privacy/page.tsx` | 14   | Date the privacy note was last updated.                       |
| `{{TBD}}` | `app/privacy/page.tsx` | 68   | How many named individuals can read application data.         |
| `{{TBD}}` | `app/privacy/page.tsx` | 81   | How long applications are kept after a cohort closes.         |
| `{{TBD}}` | `app/privacy/page.tsx` | 99   | Working days to action a deletion or access request.          |
| `{{TBD}}` | `app/privacy/page.tsx` | 111  | Registered entity name and address (the data fiduciary).      |
| `{{TBD}}` | `app/terms/page.tsx`   | 16   | Date the terms were last updated.                             |
| `{{TBD}}` | `app/terms/page.tsx`   | 39   | Where the membership agreement lives, and its headline terms. |
| `{{TBD}}` | `app/terms/page.tsx`   | 57   | Registered entity, address and jurisdiction.                  |

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
2. **Casting.** The stand-ins do not meet the casting brief below. Only two of the six
   show a woman in the 40–60 range, and none is an Indian woman shot in an Indian space.
   That gap is the single most expensive thing left on this list — see why below.

Replacing one is a one-file operation: drop a correctly named file into
`/public/images/` at the stated ratio and rebuild. The slots, filenames, ratios, subject
notes, alt text and focal points are all in
[`public/images/manifest.ts`](public/images/manifest.ts); alt text and `focus` must be
updated to match whatever replaces the stand-in.

| Slug       | File           | Ratio | Where it appears                        |
| ---------- | -------------- | ----- | --------------------------------------- |
| `hero`     | `hero.jpg`     | 3:2   | Hero                                    |
| `baseline` | `baseline.jpg` | 4:5   | It starts with facts                    |
| `practice` | `practice.jpg` | 4:5   | The method, first pillar                |
| `guide`    | `guide.jpg`    | 1:1   | The method, the named guide             |
| `room`     | `room.jpg`     | 3:2   | The room, full-bleed with text overlaid |
| `retreat`  | `retreat.jpg`  | 16:9  | The room, retreats                      |

Current stand-ins: hero and baseline are two crops of one frame; practice and guide are
single frames; room and retreat are from the remaining two.

**All photography must be licensed or originally shot.** Nothing may be pulled from
Unsplash URLs, Pinterest or any hotlinked source, and no frame may carry another
company's logo.

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
