import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "--bone", use: "page background", className: "bg-bone" },
  { name: "--sand", use: "alternating section background", className: "bg-sand" },
  { name: "--linen", use: "hairlines, inactive, image placeholders", className: "bg-linen" },
  { name: "--clay", use: "accent, focus rings, rules", className: "bg-clay" },
  { name: "--clay-deep", use: "links, filled buttons, errors (4.5:1 safe)", className: "bg-clay-deep" },
  { name: "--umber", use: "dark sections, footer", className: "bg-umber" },
  { name: "--ink", use: "headings and body on light", className: "bg-ink" },
  { name: "--muted", use: "secondary text, labels", className: "bg-muted" },
  { name: "--muted-deep", use: "secondary text on --linen (4.5:1 safe)", className: "bg-muted-deep" },
  { name: "--gold", use: "rules under eyebrows, step markers", className: "bg-gold" },
  { name: "--sage", use: "accent", className: "bg-sage" },
  { name: "--sage-deep", use: "success text (4.5:1 safe)", className: "bg-sage-deep" },
];

const CONTRAST = [
  { pair: "--ink on --bone", ratio: "15.1:1", verdict: "pass" },
  { pair: "--muted on --bone", ratio: "5.14:1", verdict: "pass" },
  { pair: "--muted on --sand", ratio: "4.56:1", verdict: "pass" },
  { pair: "--muted on --linen", ratio: "3.97:1", verdict: "text: fail — use --muted-deep" },
  { pair: "--muted-deep on --linen", ratio: "4.64:1", verdict: "pass" },
  { pair: "--clay on --bone", ratio: "4.09:1", verdict: "text: fail — use --clay-deep" },
  { pair: "--clay-deep on --bone", ratio: "5.75:1", verdict: "pass" },
  { pair: "--bone on --clay-deep", ratio: "5.75:1", verdict: "pass" },
  { pair: "--sage on --bone", ratio: "3.20:1", verdict: "text: fail — use --sage-deep" },
  { pair: "--sage-deep on --bone", ratio: "5.27:1", verdict: "pass" },
  { pair: "--bone on --umber", ratio: "25.7:1", verdict: "pass" },
  { pair: "--muted-dark on --umber", ratio: "7.19:1", verdict: "pass" },
  { pair: "--gold on --umber", ratio: "4.71:1", verdict: "pass" },
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
            Everything on the site is built from what is on this page. If a component needs a value
            that is not here, the value is wrong, not the component.
          </p>
        </header>

        <section className="flex flex-col gap-10">
          <h2 className="t-eyebrow">Type</h2>
          <hr className="rule" />
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Display · Instrument Serif · clamp(2.75rem, 6.5vw, 5.25rem) · lh 1.04 · ls −0.02em
              </p>
              <p className="t-display">
                A year of practice, <span className="em-serif">held</span> for you
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                H2 · Instrument Serif · clamp(2rem, 4vw, 3.25rem) · lh 1.1 · ls −0.015em
              </p>
              <p className="t-h2">
                People do not quit rooms where they are <span className="em-serif">known</span>
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">H3 · Instrument Serif · 1.5rem · lh 1.2</p>
              <p className="t-h3">One curriculum, not six subscriptions</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">
                Lede · Inter 400 · 1.1875rem · lh 1.65 · --fg-muted · 58ch
              </p>
              <p className="t-lede">
                Strength and mobility, yoga, breathwork, sadhana and Ayurvedic daily rhythm,
                sequenced into one plan by one guide who already knows your history.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">Body · Inter 400 · 1rem · lh 1.7 · 68ch</p>
              <p className="t-body">
                Before anything is prescribed, you are measured. A full biomarker panel. A movement
                and mobility screen. Sleep, stress and the shape of an ordinary week, mapped. Then
                an hour sitting down with all of it in front of you.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="t-eyebrow">Eyebrow · Inter 500 · 0.6875rem · ls 0.18em · uppercase</p>
              <p className="t-eyebrow">Bengaluru · founding cohort</p>
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
                  className={`${swatch.className} h-14 w-14 flex-none border border-linen`}
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
              <input id="sg-text" className="field-input" placeholder="As you would like it read" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="t-meta font-medium" htmlFor="sg-text-error">
                Email
              </label>
              <input id="sg-text-error" className="field-input" aria-invalid="true" defaultValue="not-an-email" />
              <p className="t-meta text-clay-deep">That does not look like an email address.</p>
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
              <span className="t-meta">A consent checkbox, unticked by default.</span>
            </label>
          </div>
        </section>

        <section className="on-dark bg-surface flex flex-col gap-8 p-10">
          <h2 className="t-eyebrow">Dark section</h2>
          <hr className="rule" />
          <p className="t-h2 text-fg">
            {"{{COHORT_SIZE}}"} <span className="em-serif">places</span>
          </p>
          <p className="t-body text-fg-muted">
            Bengaluru. Referral or application only. Hairlines go gold, type goes bone, and the
            components do not change.
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
