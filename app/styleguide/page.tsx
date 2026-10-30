import type { Metadata } from "next";

import { Lockup, ToranaMark } from "@/components/Brand";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "--bone", use: "page background", className: "bg-bone" },
  {
    name: "--ink",
    use: "type on light; the primary dark ground",
    className: "bg-ink",
  },
  { name: "--vetiver", use: "the second dark ground", className: "bg-vetiver" },
  {
    name: "--brass",
    use: "rules, borders and large type only",
    className: "bg-brass",
  },
  {
    name: "--brass-deep",
    use: "text under 24px on bone",
    className: "bg-brass-deep",
  },
  {
    name: "--sand",
    use: "alternating sections; secondary text on dark",
    className: "bg-sand",
  },
  {
    name: "--muted",
    use: "derived — secondary text on light",
    className: "bg-muted",
  },
  {
    name: "--brass-text",
    use: "derived — brass text on sand",
    className: "bg-brass-text",
  },
];

const CONTRAST = [
  { pair: "--ink on --bone", ratio: "14.29:1", verdict: "pass" },
  { pair: "--ink on --sand", ratio: "10.50:1", verdict: "pass" },
  { pair: "--muted on --bone", ratio: "6.55:1", verdict: "pass" },
  { pair: "--muted on --sand", ratio: "4.81:1", verdict: "pass" },
  {
    pair: "--brass on --bone",
    ratio: "2.99:1",
    verdict: "rules and borders only, never text",
  },
  { pair: "--brass-deep on --bone", ratio: "5.18:1", verdict: "pass" },
  {
    pair: "--brass-deep on --sand",
    ratio: "3.81:1",
    verdict: "text: fail — use --brass-text",
  },
  { pair: "--brass-text on --bone", ratio: "6.37:1", verdict: "pass" },
  { pair: "--brass-text on --sand", ratio: "4.68:1", verdict: "pass" },
  { pair: "--bone on --ink", ratio: "14.29:1", verdict: "pass" },
  { pair: "--bone on --vetiver", ratio: "9.61:1", verdict: "pass" },
  { pair: "--sand on --ink", ratio: "10.50:1", verdict: "pass" },
  { pair: "--sand on --vetiver", ratio: "7.06:1", verdict: "pass" },
  { pair: "--brass on --ink", ratio: "4.79:1", verdict: "pass" },
  {
    pair: "--brass on --vetiver",
    ratio: "3.22:1",
    verdict: "rules and large type only",
  },
];

export default function StyleguidePage() {
  return (
    <main className="section">
      <div className="shell flex flex-col gap-24">
        <header className="flex flex-col gap-4">
          <p className="t-eyebrow">Internal · not indexed</p>
          <h1 className="t-display">
            The type scale and <span className="em-serif">palette</span>
          </h1>
          <p className="t-lede">
            Everything on the site is built from what is on this page. If a
            component needs a value that is not here, the value is wrong, not
            the component.
          </p>
        </header>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">The mark</h2>
          <hr className="rule" />
          <div className="flex flex-wrap items-end gap-14">
            <ToranaMark className="h-24 w-24 text-fg" />
            <ToranaMark className="h-12 w-12 text-fg" />
            <ToranaMark className="h-8 w-8 text-fg" compact />
            <Lockup variant="inline" />
            <Lockup variant="wordmark" />
          </div>
          <p className="t-meta text-fg-muted">
            Clear space on every side is one quarter of the mark&apos;s width.
            Below 32px the lower architrave is dropped. The gateway is never
            closed.
          </p>
        </section>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">Type</h2>
          <hr className="rule" />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Display · Instrument Serif · clamp(2.75rem, 6.5vw, 5.25rem) · lh
                1.04 · ls −0.02em
              </p>
              <p className="t-display">
                A year of practice, <span className="em-serif">held</span> for
                you
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                H2 · Instrument Serif · clamp(2rem, 4vw, 3.25rem) · lh 1.1 · ls
                −0.015em
              </p>
              <p className="t-h2">
                People do not quit rooms where they are{" "}
                <span className="em-serif">known</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                H3 · Instrument Serif · 1.5rem · lh 1.2
              </p>
              <p className="t-h3">One curriculum, not six subscriptions</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Lede · Inter 400 · 1.1875rem · lh 1.65 · --fg-muted · 58ch
              </p>
              <p className="t-lede">
                Strength and mobility, yoga, breathwork and meditation,
                Ayurvedic daily rhythm, sequenced into one plan by one guide who
                already knows your history.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Body · Inter 400 · 1rem · lh 1.7 · 68ch
              </p>
              <p className="t-body">
                Before anything is prescribed, you are measured. A full
                biomarker panel. A movement and mobility screen. Sleep, stress
                and the shape of an ordinary week, mapped. Then an hour sitting
                down with all of it in front of you.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Eyebrow · Inter 500 · 0.6875rem · ls 0.18em · uppercase
              </p>
              <p className="t-eyebrow">Longevity, as India knew it first.</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">Meta and form · Inter 400 · 0.875rem</p>
              <p className="t-meta">WhatsApp number</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">Palette</h2>
          <hr className="rule" />
          <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {PALETTE.map((swatch) => (
              <li key={swatch.name} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className={`${swatch.className} h-14 w-14 flex-none border border-rule`}
                />
                <span className="flex flex-col">
                  <span className="t-meta">{swatch.name}</span>
                  <span className="t-meta text-fg-muted">{swatch.use}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">Measured contrast</h2>
          <hr className="rule" />
          <ul className="flex flex-col">
            {CONTRAST.map((row) => (
              <li
                key={row.pair}
                className="flex flex-wrap justify-between gap-4 border-b border-rule py-3"
              >
                <span className="t-meta">{row.pair}</span>
                <span className="t-meta text-fg-muted">
                  {row.ratio} — {row.verdict}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">Controls</h2>
          <hr className="rule" />
          <div className="flex flex-wrap items-center gap-6">
            <button type="button" className="btn btn-primary">
              Apply for the founding cohort
            </button>
            <button type="button" className="btn btn-quiet">
              Read the method
            </button>
            <a href="#" className="link t-meta">
              A text link
            </a>
          </div>
          <div className="flex max-w-md flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="t-meta font-medium" htmlFor="sg-text">
                Full name
              </label>
              <input
                id="sg-text"
                className="field-input"
                placeholder="As you would like it read"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="t-meta font-medium" htmlFor="sg-text-error">
                Email
              </label>
              <input
                id="sg-text-error"
                className="field-input"
                aria-invalid="true"
                defaultValue="not-an-email"
              />
              <p className="t-meta text-brass-text">
                That does not look like an email address.
              </p>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="t-meta font-medium">Age</legend>
              {["40–45", "46–50"].map((band) => (
                <label key={band} className="flex items-center gap-3">
                  <input type="radio" name="sg-radio" className="field-radio" />
                  <span className="t-meta">{band}</span>
                </label>
              ))}
            </fieldset>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="field-check mt-0.5" />
              <span className="t-meta">
                A consent checkbox, unticked by default.
              </span>
            </label>
          </div>
        </section>

        <section className="on-dark bg-surface flex flex-col gap-8 p-10">
          <h2 className="t-eyebrow">Dark section</h2>
          <hr className="rule" />
          <p className="t-h2 text-fg">
            A dark <span className="em-serif">section</span>
          </p>
          <p className="t-body text-fg-muted">
            Referral or application only. Hairlines go brass, type goes bone,
            and the components do not change.
          </p>
          <div>
            <button type="button" className="btn btn-primary">
              Apply
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
