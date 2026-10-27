import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { AGE_RANGE, CITY, cohortSizeLabel } from "@/lib/config";

type HeroProps = {
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Full viewport. Type in a six-column well on the left, the photograph in the five
 * columns on the right. The display lines come in on load, 120ms apart.
 */
export function Hero({ ctaHref, ctaLabel }: HeroProps) {
  return (
    <section
      id="top"
      className="anchor relative min-h-[100svh] pt-28 pb-16 lg:pt-32"
    >
      <div className="shell grid-12 min-h-[calc(100svh-13rem)] items-center">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-6">
          <Reveal as="p" className="t-eyebrow">
            {CITY.toUpperCase()} · FOUNDING COHORT OF {cohortSizeLabel()}
          </Reveal>

          <h1 className="t-display">
            <Reveal as="span" className="block" delay={120}>
              A year of practice,
            </Reveal>
            <Reveal as="span" className="block" delay={240}>
              <span className="em-serif">held</span> for you.
            </Reveal>
          </h1>

          <Reveal as="p" className="t-lede" delay={360}>
            Strength and mobility, yoga, breathwork, sadhana and Ayurvedic daily
            rhythm, sequenced into one plan by one guide who knows your history.
            A membership, not a programme.
          </Reveal>

          <Reveal
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
            delay={480}
          >
            <a href={ctaHref} className="btn btn-primary">
              {ctaLabel}
            </a>
            <a href="#method" className="t-meta link-quiet">
              Read the method
            </a>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <Reveal delay={300}>
            <Figure
              slug="hero"
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </Reveal>
        </div>
      </div>

      <div className="shell">
        <hr className="rule" />
        <p className="t-meta pt-5 text-fg-muted">
          Women {AGE_RANGE}, in {CITY}, not training for anything.
        </p>
      </div>
    </section>
  );
}
