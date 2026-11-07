# The member demo

A clickable walk-through of the member app, at `/demo`. Sixteen screens in the order a
member meets them, from the first screen she opens to the view her guide sees. It runs on
invented data held in one file and in her browser — there is no account, no database call
and no payment anywhere in it.

Everything in it is invented: the member, the guide, the clinical practitioner, every
reading and every reference band. Read [what has to be true before this is shown to
anyone](PRD.md#14-what-has-to-be-true-before-this-is-shown-to-anyone) before it goes in
front of a room.

---

## Running it

```bash
npm install
npm run dev
```

Then open **http://localhost:3000/demo**.

The demo needs no database, no API key and no `.env.local`. If you have not set the
environment up, the dev server prints a warning listing the missing variables on startup —
that is the marketing site's data layer asking for its keys, and the demo does not use any
of them. The sixteen screens, the report PDF and the controls all work without it.

`npm run build` also needs nothing — every demo route prerenders to static HTML, so the
build output shows `○` or `●` against each one.

`npm start` is the exception. The production boot check refuses to start the server at all
when a variable is missing, which is deliberate: the marketing site must not go up without
its database. If you want to serve the demo from a production build and have no
environment set, give it throwaway values — the demo reads none of them:

```bash
npm run build
NEXT_PUBLIC_SITE_URL=http://localhost:3000 DATABASE_URL=postgres://demo \
RESEND_API_KEY=demo NOTIFY_EMAIL=demo@example.com FROM_EMAIL=demo@example.com \
EXPORT_TOKEN=demo-demo-demo-demo npm start
```

`/demo` is excluded from `robots.txt` and carries `noindex`.

---

## The three-minute walk-through

Open the controls, press **Play the journey**, and it walks itself in **3m 1s**. Each
screen holds for as long as it needs rather than a fixed beat — the report and the markers
get time to be read, the two booking screens do not.

| #   | At   | Screen            | What it is there to show                                                 |
| --- | ---- | ----------------- | ------------------------------------------------------------------------ |
| 1   | 0:00 | Welcome           | The lockup over a slow film of light on a jaali screen. Invitation only. |
| 2   | 0:08 | Consent           | What is collected, who reads it, how long it is kept, in plain words.    |
| 3   | 0:16 | What she is asked | The nine areas a guide covers on the call, as a deck she swipes.         |
| 4   | 0:31 | Journey           | The five steps ahead of her, and where she is in them.                   |
| 5   | 0:40 | Book a call       | A time with her guide, picked from what is open.                         |
| 6   | 0:49 | Baseline panel    | The panel she gives, grouped by system, with how to prepare.             |
| 7   | 0:58 | Report            | Her baseline written as prose, downloadable as a PDF.                    |
| 8   | 1:15 | Markers           | 24 markers, each on a track showing where she sits against its band.     |
| 9   | 1:36 | Plan              | The five pillars in the order she and her guide chose, each with a goal. |
| 10  | 1:49 | An action         | One action opened up — why it is there, how to do it, how long.          |
| 11  | 1:58 | Today             | Her one goal, the day she is on, the practice, her guide, what is next.  |
| 12  | 2:12 | Calendar          | The month at a glance, including the travel rule.                        |
| 13  | 2:23 | Guide             | Her guide, and seven messages between them.                              |
| 14  | 2:33 | Immersions        | Three gatherings as picture cards, and what each is for.                 |
| 15  | 2:41 | Progress          | What she reported herself on days 1, 15 and 30.                          |
| 16  | 2:51 | Team view         | The same member seen from the other side of the house.                   |

To walk it by hand instead, the tabs at the foot of the phone move between the five
screens a member uses daily; the controls move between all sixteen. Two screens are
swipeable — the areas deck on _What she is asked_, and the immersions on _Today_ — and
the day strip across the top of _Today_ takes her to any day of the month.

---

## The controls

A small pill at the foot of the stage, marked with the torana. It is shut by default,
because a demo should not be framed by its own scaffolding. Tap it to open; tap it again,
or press **Escape**, to close.

| Control            | What it does                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Jump**           | Any of the sixteen screens. Shows where you are — "8 of 16".                                                             |
| **Day**            | Any day of the 30, with Day 1 / 15 / 30 to hand. The day strip on Today, the practice and the calendar all move with it. |
| **Readings shown** | Baseline, month 3 or month 6 — for showing a trend in a pitch.                                                           |
| **Auto-play**      | Walks all sixteen on a timer. A brass hairline tracks it when the bar is shut.                                           |
| **Reset demo**     | Clears `localStorage`, returns to screen 1 at day 1 and baseline.                                                        |

Jumping and playing shut the panel, because you have chosen and now want to see the
screen. The day slider and the readings chips leave it open, because you watch Today change
as you drag.

**Month 3 and month 6 are illustrative.** The screen says so beside the control, and names
the day she is actually on, so a later reading can never be mistaken for one she has had.

The permanent **Sample data** marker sits in the header of every screen, never only in a
tooltip.

---

## How the readings are drawn

A reading's job is to be read against its band, so each marker sits on a **track**
rather than a sparkline: the reference band is shaded on it, the live reading is a
filled dot, and the earlier readings stay behind as open dots so the direction of
travel is visible without a second chart. Reveal month 3 or month 6 and the dot
travels. Opening a marker gives the same three readings as a time chart with the
band shaded behind them and every point labelled.

The live dot is **ink, not brass**. Brass measures 2.99:1 on bone, so it can never
be the only thing saying where a reading sits — it stays decorative, and the
number, the band and the status are all printed in words beside the track.

Both are drawn from the strings in the content file; no numeric fields were added
and no value is computed. A band written in a form the parser does not know simply
draws no band, and the reading still shows.

## What is invented, and what has to be replaced

| Invented                                                                        | Who replaces it                                                                                                                                             |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meera Rao, the member                                                           | Nobody — she is the illustration                                                                                                                            |
| Ananya Iyer, the guide                                                          | A real name, or label her as a placeholder on screen                                                                                                        |
| Dr. Shalini Menon, the clinical practitioner                                    | Same                                                                                                                                                        |
| The panel, all 24 markers, every reference band, the guide's paragraph          | The clinical lead, before a member sees it — and ideally before an investor does, since a clinician in the room will read the numbers                       |
| The day-by-day allocation across the five pillars                               | The practitioner. The 30-day structure is hers; mapping it onto the pillars is not                                                                          |
| The nine one-line descriptions of what each area covers, on _What she is asked_ | Nobody needs to, but they are mine, not the practitioner's. The 26 questions under them are hers, unchanged                                                 |
| The four generated pictures: the welcome film and the three immersion cards     | Photographs of the real rooms, once they exist. They contain no people on purpose — see PLACEHOLDERS.md §7, including the licence check and the 9.4 MB film |

No screen says anything is treated, cured, prevented, diagnosed or fixed. Marker status is
only ever **In range**, **Worth watching** or **Low**. The app generates nothing of its own:
every marker, band, figure and sentence comes from the content file, [lib/demo-data.ts](lib/demo-data.ts).

---

## Where things are

| Path                 | What it holds                                             |
| -------------------- | --------------------------------------------------------- |
| `lib/demo-data.ts`   | Every word, number and band in the demo. One file.        |
| `lib/demo-state.tsx` | Day, ticks, answers, readings shown. `localStorage` only. |
| `components/demo/`   | The frame, the header and tabs, the controls, the PDF.    |
| `app/demo/`          | The sixteen screens, in folders named for the journey.    |
| `PRD.md`             | What it is for, and the decisions behind it.              |

---

## The way in from the marketing page

A section sits between **The method** and the concierge, headed _See what the year actually
looks like_, with a brass-ruled button — **See the member journey →** — and the line
_A three-minute walk-through, on sample data._

It opens the demo full-screen in an iframe of `/demo`. An iframe rather than an inline
mount, because the demo already draws its own phone frame on a vetiver ground and holds
its own state in `localStorage`, and a document boundary keeps all of that off the
marketing page. Nothing of the demo is fetched until the button is pressed, so the home
page's First Load JS goes from **146 kB to 147 kB** and the ten megabytes of demo media
cost it nothing.

### What it cost the marketing page

Lighthouse, desktop preset, against a production build on localhost. Three runs each
side, medians reported, with the button added to the page as the only difference.

| Lighthouse (median of 3) | Before | After |
| ------------------------ | ------ | ----- |
| Performance              | 100    | 100   |
| Accessibility            | 100    | 100   |
| Best practices           | 100    | 100   |
| SEO                      | 100    | 100   |

| Metric                   | Before | After  |
| ------------------------ | ------ | ------ |
| First Contentful Paint   | 267 ms | 282 ms |
| Largest Contentful Paint | 578 ms | 433 ms |
| Total Blocking Time      | 0 ms   | 0 ms   |
| Speed Index              | 320 ms | 485 ms |
| Cumulative Layout Shift  | 0.000  | 0.000  |
| Total page weight        | 403 KB | 404 KB |
| First Load JS            | 146 kB | 147 kB |

**Read the timings as unchanged, not as a gain or a loss.** The three runs spread wider
than the gaps between the medians — Largest Contentful Paint ranged 405–602 ms before and
402–574 ms after, Speed Index 299–492 ms and 283–570 ms. The only differences that are
real are the two that are not timings: **one kilobyte** of page weight and one of
first-load JS. Nothing of the demo, including its megabyte of pictures and film, is
fetched until the button is pressed.

The dialog locks the page behind it, traps Tab, returns focus to the button on close, and
closes on **Escape** — including when focus is inside the demo, which is its own document
and needs its own listener. It carries a permanent **Sample data · illustrative demo**
mark. On a phone the demo runs full-bleed with no frame, so that mark gets a strip of its
own above the demo's header rather than landing on top of it.

`/demo` still works as a direct URL, and is still `noindex` and disallowed in
`robots.txt`.

## Not done yet

Nothing here is deployed. The four generated pictures still need their licence
checked before any public use, and the three invented people still need replacing or
labelling — both in PLACEHOLDERS.md §7 and in the table above.
