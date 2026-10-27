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

| Marker | File | Line | What is needed |
| --- | --- | --- | --- |
| `{{BRAND_NAME}}` | `lib/config.ts` | 9 | The club's name. Appears in the wordmark, `<title>`, OG tags, the footer and every email. |
| `{{COHORT_SIZE}}` | `lib/config.ts` | 11 | The real founding cohort number, as a number (e.g. `42`). Renders as the largest single element on the page. Set it to `null` only while it is genuinely unknown. |
| `{{CLOSE_DATE}}` | `lib/config.ts` | 17 | The real date applications close, as `"YYYY-MM-DD"`. This single value drives `isCohortOpen()`, the nav and hero CTAs, the application section and the prominence of the waitlist. Treated as end-of-day India time. |
| `NOTIFY_EMAIL` | `.env.local` / Vercel | — | Where application alerts and the waitlist digest go. An environment variable, not source. |

## 2. Public contact details

| Marker | File | Line | What is needed |
| --- | --- | --- | --- |
| `{{TBD}}` — `CONTACT_EMAIL` | `lib/config.ts` | 64 | The public address. Used in the footer, in both legal pages, and as the mailto fallback a woman is offered if the form fails on submit — so it must be an address someone actually reads. |
| `{{TBD}}` — `INSTAGRAM_HANDLE` | `lib/config.ts` | 65 | The handle. Also set `INSTAGRAM_URL` (line 66) to the full URL; while it is `null` the footer prints the handle as plain text rather than a dead link. |
| `{{TBD}}` — `GUIDE_NAME` | `lib/config.ts` | 69 | The named lead guide. Signs the applicant confirmation email and the waitlist email, both of which are written to read as though a person sent them. |

## 3. Claims that need a real answer before they are published

| Marker | File | Line | What is needed |
| --- | --- | --- | --- |
| `{{TBD}}` | `components/Method.tsx` | 91 | What "vetted" actually means: the certification, the contract and the check each practitioner passes. State the standard, not the adjective. |
| `{{TBD}}` | `components/Faq.tsx` | 44 | The honest weekly time commitment, e.g. "three to four hours". |
| `{{TBD}}` | `components/Faq.tsx` | 68 | The price. If it is deliberately held for the application call, the sentence around it already says so honestly — but the figure still has to exist somewhere before the first call. |

## 4. Legal pages

Both pages are written, specific and in the site's own type system. These gaps are the
facts only you have.

| Marker | File | Line | What is needed |
| --- | --- | --- | --- |
| `{{TBD}}` | `app/privacy/page.tsx` | 14 | Date the privacy note was last updated. |
| `{{TBD}}` | `app/privacy/page.tsx` | 68 | How many named individuals can read application data. |
| `{{TBD}}` | `app/privacy/page.tsx` | 81 | How long applications are kept after a cohort closes. |
| `{{TBD}}` | `app/privacy/page.tsx` | 99 | Working days to action a deletion or access request. |
| `{{TBD}}` | `app/privacy/page.tsx` | 111 | Registered entity name and address (the data fiduciary). |
| `{{TBD}}` | `app/terms/page.tsx` | 16 | Date the terms were last updated. |
| `{{TBD}}` | `app/terms/page.tsx` | 39 | Where the membership agreement lives, and its headline terms. |
| `{{TBD}}` | `app/terms/page.tsx` | 57 | Registered entity, address and jurisdiction. |

The privacy note names Neon, Resend and Vercel as processors. If you swap any of them,
that sentence has to change with it.

## 5. The brand mark

`app/icon.svg` is a neutral umber square with a gold cross-rule — a deliberate
non-logo, so that nothing ships pretending to be a brand mark. Replace it with the real
one, and add `app/apple-icon.png` at 180×180 at the same time.

---

## 6. Photography — a hard brief, not a preference

The site ships without photography. Every slot renders as a warm `--linen` block
carrying its subject note and ratio. Drop a correctly named file into `/public/images/`
and rebuild; nothing else changes. The slots, their filenames, ratios, subjects and
alt text are all in [`public/images/manifest.ts`](public/images/manifest.ts).

| Slug | File | Ratio | Where it appears |
| --- | --- | --- | --- |
| `hero` | `hero.jpg` | 3:2 | Hero |
| `baseline` | `baseline.jpg` | 4:5 | It starts with facts |
| `practice` | `practice.jpg` | 4:5 | The method, first pillar |
| `guide` | `guide.jpg` | 1:1 | The method, the named guide |
| `room` | `room.jpg` | 3:2 | The room, full-bleed with text overlaid |
| `retreat` | `retreat.jpg` | 16:9 | The room, retreats |

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
