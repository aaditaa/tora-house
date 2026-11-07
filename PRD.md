# Tora House — member app demo

A mobile-first clickable demo of the member journey, on dummy data, that a mentor or an
investor can walk in three minutes. It is a demo, not a product.

Status: **PRD for review. No code written yet.**

---

## 1. Goal

Make the whole member journey legible in three minutes, in the brand, on a phone-shaped
frame, without anyone having to imagine the parts that are missing.

The argument the demo has to land, in order:

1. Her guide takes her through the 26 questions on a call — not a sign-up form, and not a form she fills in herself.
2. She is measured before anything is prescribed. **The baseline is the argument.**
3. The plan is written from her readings, across five pillars she and her guide put in order, day by day.
4. A named person reads it with her, every Friday.
5. Three and six months later, the same markers are read again.

Everything else on screen is in service of that sequence.

## 2. Who it's for

| Audience                           | What they need in three minutes                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Mentor / advisor                   | That the journey is coherent and the follow-up is real, not aspirational.                                         |
| Investor                           | That there is a measurable before-and-after, and that it is operable by a small team.                             |
| The practitioner and clinical lead | That nothing here claims to treat anything, and that every band and every interpretive sentence is theirs to set. |

Not built for: a member. Nobody signs in, nothing is saved anywhere real.

## 3. Decisions taken before building

| Question           | Decision                                                    | Why                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static export      | **Dropped.** `/demo` is a route group in the existing repo. | The marketing site has four API routes, a Vercel cron, `revalidate` on `/`, and `next/image` optimisation. `output: "export"` would break all of them. Every demo screen is a client component holding state in `localStorage`, so Next prerenders them as static regardless — which is the behaviour static export was asking for. One deployment, one domain, no iframe. |
| Opening day        | **Day 1, Tue 1 Dec 2026.**                                  | Nothing on screen implies time has passed that hasn't. The demo bar jumps to Day 15 and Day 30 for a pitch.                                                                                                                                                                                                                                                                |
| High tea immersion | **Late November 2026, before Day 1.**                       | Keeps it "the first", keeps Appendix D untouched, and gives the Immersions screen something in its past tense.                                                                                                                                                                                                                                                             |
| PDF                | **`@react-pdf/renderer`**, lazy-loaded.                     | Takes the Bodoni Moda and Jost TTFs already in `assets/fonts/`, so the PDF is in the real brand type. Real multi-page layout, which a ten-section report needs. Costs nothing until she taps Download.                                                                                                                                                                     |

**Only new dependency: `@react-pdf/renderer`.** Nothing else is installed.

## 4. Architecture

```
app/
  (marketing)/            ← untouched. Existing pages move into a route group only if
                            that can be done without changing any URL.
  demo/
    layout.tsx            ← own <html> scope: phone frame, demo bar, Sample data marker.
                            Inherits no marketing chrome.
    page.tsx              ← 1 Welcome
    consent/              ← 2
    survey/               ← 3   (what the guide asks: nine areas, swipeable)
    journey/              ← 4
    book-call/            ← 5
    book-panel/           ← 6
    report/               ← 7
    plan/                 ← 8
    plan/[actionId]/      ← 9
    today/                ← 10  (home)
    calendar/             ← 11
    guide/                ← 12
    immersions/           ← 13
    progress/             ← 14
    markers/              ← 16
    markers/[markerId]/   ← 16 detail
    team/                 ← 15  (reached by a small link, never from her nav)
components/demo/          ← demo-only components, prefixed so nothing collides
lib/demo-data.ts          ← ALL content. One file.
lib/demo-state.ts         ← localStorage read/write, the demo clock, reset
```

**Containment.** The demo layout sets its own tokens on a wrapper element, not on
`:root`. The marketing pages keep theirs. No global style, font or analytics change.

**Routing note.** If moving the marketing pages into a `(marketing)` group risks any URL
change, they stay where they are and `/demo` simply sits beside them. The marketing site
not breaking outranks folder tidiness.

## 5. Brand

Taken from the live site's existing token layer, re-declared locally in the demo scope.

| Token      | Hex       | Use                              |
| ---------- | --------- | -------------------------------- |
| Bone       | `#F3EEE4` | primary ground                   |
| Ink        | `#17211C` | type, the mark, reversed grounds |
| Vetiver    | `#2C4034` | secondary ground, panels         |
| Brass      | `#A98448` | rules, borders, large type only  |
| Deep brass | `#7A5F2E` | any type under 24px on Bone      |
| Sand       | `#D9CDB4` | tertiary ground, tints           |

Type: **Bodoni Moda** 400 + italic for display and the wordmark, widely letterspaced in
the lockup. **Jost 300** for body and UI; Jost 300 widely tracked for labels and small
caps. Both already loaded via `next/font` on this site.

The mark: `components/Torana.tsx` — inline SVG, props `size` and `color`. Two stambha,
two architraves with upturned tips, a lotus finial, **threshold left open**. Clear space
a quarter of the mark's width. Below 32px the lower architrave is dropped. The gateway
is never closed. (The site already has this component; the demo reuses it.)

**Behaviour.** One thing per screen. Generous type. No streaks, no badges, no red. A
missed day is noted quietly. Her guide is a named person with a face, on the screen she
opens most. Indian lineage in the language and the structure, never in the ornament.

**Contrast.** Brass is 2.99:1 on Bone and is never used for type under 24px — deep brass
is. Every pairing in the demo is measured before it ships, as on the marketing site.

## 6. The dummy member

**Meera Rao, 48, Indiranagar, Bengaluru.** Wants to sleep through the night, wants her
knees quiet on the stairs, wants the energy she had at forty.

- Guide: **Ananya Iyer** — dummy. Portrait is a drawn Sand placeholder with her initials,
  not a stock photograph of an invented clinician.
- Clinical sign-off: **Dr. Shalini Menon** — dummy.
- Her month: **1–30 December 2026.** The demo clock is pinned there and never reads the
  real system date.

## 7. Screens

Journey order. Each is its own path so any one can be linked directly.

| #   | Route                   | What is on it                                                                                                                                                                                                                                                                                                 | Source       |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | `/demo`                 | Welcome: name, phone, "I have an invitation". Inert — any input continues.                                                                                                                                                                                                                                    | —            |
| 2   | `/demo/consent`         | What is collected, who sees it, how long it is kept, how to have it deleted. Prominent plain note: this is not medical advice, nothing here treats, cures or diagnoses. Written to DPDP expectations.                                                                                                         | —            |
| 3   | `/demo/survey`          | **What your guide will ask.** The 26 questions grouped into nine areas, as a swipeable deck of cards with the real questions on each. Nothing is typed in: a guide asks these on a call and writes them down. Her answers are already in state.                                                               | **A**        |
| 4   | `/demo/journey`         | survey → 1:1 call → baseline panel → report → plan. Where she is, what's next, what is being waited on.                                                                                                                                                                                                       | —            |
| 5   | `/demo/book-call`       | Ananya's portrait, credentials, three open slots.                                                                                                                                                                                                                                                             | —            |
| 6   | `/demo/book-panel`      | Home collection or centre, a date, how to prepare. Called a **baseline panel**. Lists marker _groups_, not individual tests, plus the fasting instruction.                                                                                                                                                    | **F**        |
| 7   | `/demo/report`          | Summary; full baseline panel grouped by system, each reading with its band and a status chip; her guide's paragraph; **Download PDF**. Stamped _Sample data_.                                                                                                                                                 | **F**        |
| 8   | `/demo/plan`            | Five pillars in the order she and her guide chose, each with its goal, each expanding to why it sits there and the actions under it. Pain management and recovery also carries what it holds for her two complaints, what has already become a daily habit, and what we do and never do.                      | **B**, **C** |
| 9   | `/demo/plan/[actionId]` | What to do, why, how often, the resource. The note renders as the how-to. Inert branded video/audio placeholder where the type says so.                                                                                                                                                                       | **C**        |
| 10  | `/demo/today`           | **Home.** A swipeable day strip across the month; her one goal; today's practice with tick-offs (the day's own items first, the five every-day ones folded behind); her guide; a swipeable deck of immersions, what is still ahead first. Ticks persist in `localStorage`.                                    | **D**        |
| 11  | `/demo/calendar`        | Real December 2026 month view, day by day. Tapping a day opens its items. Immersions and check-ins marked differently from routine.                                                                                                                                                                           | **D**        |
| 12  | `/demo/guide`           | Scripted thread with Ananya, next check-in date, call button.                                                                                                                                                                                                                                                 | **E**        |
| 13  | `/demo/immersions`      | Upcoming, a book action, and attended. High tea (late Nov, attended), sound meditation (Day 13), pickleball (Day 27). **No prices anywhere.**                                                                                                                                                                 | **D**        |
| 14  | `/demo/progress`        | Completion across the four weeks, how she has felt, and the Day 1 / 15 / 30 self-reported measures. Marked illustrative. At Day 1, only Day 1 is populated.                                                                                                                                                   | **E**        |
| 15  | `/demo/team`            | Internal. Member list, where each woman is, which reports need signing, who has gone quiet. Reached by a small "Team view" link, never from her navigation.                                                                                                                                                   | **E**        |
| 16  | `/demo/markers`         | **The screen that carries the argument.** Every marker grouped by system: plain-language name, current reading, status chip, sparkline baseline → M3 → M6. Segmented control switches Baseline / Month 3 / Month 6. **Default baseline, later columns greyed until toggled.** Tapping a row opens the marker. | **F**        |

### Screen 16, in detail

- Row: plain-language name, reading, band shown next to it, status chip.
- Status words are only **In range**, **Worth watching**, **Low**. Never _abnormal_,
  _deficient_, _pre-diabetic_, _high risk_ or any diagnostic label.
- **FSH renders with no status chip**, carrying the line _"a marker of where she is, not
  something to improve."_ Nothing implies menopause is a problem to be solved.
- Lipoprotein(a) shows baseline only, labelled _measured once_.
- A tappable note explains why bands are read against Indian reference points — rendered
  as supplied copy from Appendix F, verbatim.
- Detail view: one sentence a non-clinician understands, which pillar moves it, what her
  readings have done, the note from her guide.

## 8. Data shape — `lib/demo-data.ts`

Every question, action, calendar day, message, marker and label lives here and nowhere
else, so content can be edited without opening a component.

```ts
member, guide, clinician          // Meera, Ananya, Dr Menon
DEMO_MONTH                        // { year: 2026, month: 12, days: 30, firstWeekday }
surveyQuestions: SurveyQuestion[] // 26 — id, core, prompt, type, options?, prefill, note?
pillars: Pillar[]                 // 5 — id, name, holds, preference 1-5, chosenBecause, goal
recoveryDetail                    // forHer, inHerDay, weDo, weDoNot
actions: Action[]                 // id, pillarId, label, frequency, resourceType, note
fixedDaily: string[]              // wake · breathing · light and air · journal · bedtime
calendar: CalendarDay[]           // 30 — day, date, weekday, week, added[], kind[]
                                  // kind: routine | immersion | checkIn | assessment
weeks: Week[]                     // 4 — theme, dayRange
immersions: Immersion[]           // title, date, state: attended | upcoming
markerGroups: MarkerGroup[]       // system, note, movedBy, markers[]
markers: Marker[]                 // id, name, plain, baseline, m3, m4?, band, status,
                                  //   scored: boolean, measuredOnce?: boolean, guideNote
indianReferenceNote: string       // verbatim from Appendix F
guideParagraph: string            // verbatim from Appendix F
messages: Message[]               // day, from, text — the scripted thread
selfReported: SelfReport[]        // day 1 | 15 | 30, seven measures each
followUp: FollowUpRow[]           // the rhythm table
missedRules: MissedRule[]         // trigger → what happens → who
redFlagRule: string               // verbatim
journeySteps: JourneyStep[]       // survey → call → panel → report → plan
teamMembers: TeamMember[]         // dummy cohort for screen 15
disclaimer: string                // one string, used on consent, report, plan and PDF
```

**Rule:** the app never generates a marker, a band, a prevalence figure, a status word or
an interpretive sentence. All of it is read from this file.

## 9. Follow-up rules

Rendered on the guide screen, the team view and in the PDF.

| When          | What                                                                     | Who                             |
| ------------- | ------------------------------------------------------------------------ | ------------------------------- |
| Every Friday  | Weekly check-in, 15 min, thread or call                                  | Ananya                          |
| Day 1, 15, 30 | Seven self-reported measures                                             | She answers, Ananya reads       |
| Day 30        | Month review call, 30 min — plan rewritten _with_ her                    | Ananya                          |
| Month 3       | Retest: survey again plus the panel repeated, report clinically reviewed | Ananya writes, Dr Menon reviews |
| Month 6       | Second retest, before/after, renewal conversation                        | Ananya                          |

**If she stops showing up** — two days: noted on the team view, nothing automated. Four
days in a week: one line from Ananya, no guilt. A week: a call, and the plan is **bent,
not broken** — session halved, hardest action dropped, one thing kept. Two weeks: rebuilt
from scratch on a 15-minute call, assuming the plan was wrong, not her. A month: a call
from the house and an invitation to the next immersion. She stays on the list either way.

**Red flag.** Anything outside what a guide should handle: Ananya stops, says so plainly,
refers to a doctor. Breathing stays gentle throughout — no forced deep breaths, no breath
retention. This is rendered on screen, not just held in a doc.

## 10. The report PDF

Client-side, A4 portrait, Bone ground, brand type and mark, _**Sample data**_ on **every
page**. Sections in order: cover · her snapshot · what we measured (full panel by system,
each with reading, band and status, and a line per group) · how we read it (Indian
reference points) · what this means (her guide's paragraph) · her plan (all five pillars)
· her first month (week by week, then day by day) · a sample day · what we retest and
when · signed by Ananya Iyer and Dr. Shalini Menon, dummy signatures, disclaimer in plain
sight.

## 11. Demo controls

A thin collapsible bar behind a small marker, hidden by default.

- Jump to any journey step.
- Jump to any day of the month — so Today can be shown at Day 1, 15 and 30.
- **Show month 3 / month 6 markers** — reveals later readings for a pitch.
- Auto-play — walks the journey on a timer, ~3 minutes end to end.
- Reset — clears `localStorage`, returns to screen 1.
- A quiet, permanent **Sample data** marker on every screen, never only in a tooltip.

## 12. Prompt 2 — the button on the live site

Built after the demo works, and **not deployed** — preview only.

- A quiet brass-ruled button below the fold, near how membership works:
  _See the member journey →_, with _A three-minute walk-through, on sample data._
- Opens a full-screen modal holding the demo in a phone frame on a Vetiver ground.
  Close affordance, escape key, focus trap, scroll lock. Full-bleed on mobile, no frame.
- Permanent label on the frame: _Sample data · illustrative demo_.
- `/demo` also works as a direct URL to send to an investor.
- Lighthouse on the landing page measured before and after; numbers reported.

Because the demo is same-repo, the modal renders the demo route directly rather than in
an iframe, so there is no second origin, no `sandbox` attribute and no duplicate font
download. If a measurement shows the modal costing the landing page anything, it becomes
a lazy dynamic import before it becomes an iframe.

## 13. Out of scope

- No backend, no auth, no accounts, no database, no API routes, no env vars.
- No payments, no card fields, **no pricing anywhere**. Membership is something she has,
  never something she buys here.
- No real names, numbers, labs or clinicians. No real health data of any kind.
- No medical claims. Never _treat_, _cure_, _reverse_, _fix_, _optimise_ or _diagnose_.
- No analytics or tracking inside the demo.
- No streaks, badges, points, leaderboards or red states.
- No dark mode, no i18n, no offline support.
- No editing of existing marketing copy, routes or components without asking first.

## 14. What has to be true before this is shown to anyone

- **Appendix F is invented, including every reference band.** The clinical lead replaces
  the panel, the bands and the guide's paragraph before a member sees it — and ideally
  before an investor does, since a clinician in the room will read the numbers.
- The day-by-day allocation in Appendix D is a mapping of the practitioner's 30-day
  programme onto the five pillars. The structure is hers; the allocation is not. She
  should read it first.
- Ananya Iyer and Dr. Shalini Menon are invented. If either screen is shown publicly,
  either the names are labelled as placeholders on screen or they are replaced.
