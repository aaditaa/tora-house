import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import { AGE_RANGE } from "@/lib/config";

type HeroProps = {
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Full viewport. The display line takes a row of its own across ten columns —
 * Bodoni needs 681px for "A year of practice," at the top of the scale, and a
 * six-column well offers 540 — then the lede and the photograph share the row
 * beneath it. The two display lines come in on load, 120ms apart.
 */
export function Hero({ ctaHref, ctaLabel }: HeroProps) {
  return (
    <section
      id="top"
      className="anchor relative min-h-[100svh] pt-28 pb-16 lg:pt-32"
    >
      <div className="shell flex min-h-[calc(100svh-13rem)] flex-col justify-center gap-12 lg:gap-16">
        <div className="grid-12">
          <div className="col-span-12 flex flex-col lg:col-span-10">
            <h1 className="t-display">
              <Reveal as="span" className="block" delay={120}>
                A year of practice,
              </Reveal>
              <Reveal as="span" className="block" delay={240}>
                <span className="em-serif">held</span> for you.
              </Reveal>
            </h1>
          </div>
        </div>

        <div className="grid-12 items-end">
          <div className="col-span-12 flex flex-col gap-8 lg:col-span-5">
            <Reveal as="p" className="t-lede" delay={360}>
              Strength and mobility, yoga, breathwork, sadhana and Ayurvedic
              daily rhythm, sequenced into one plan by one guide who knows your
              history. A membership, not a programme.
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

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal delay={300}>
              <Figure
                slug="hero"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </Reveal>
          </div>
        </div>
      </div>

      <div className="shell">
        <hr className="rule" />
        <p className="t-meta pt-5 text-fg-muted">
          For women {AGE_RANGE} who are not training for anything.
        </p>
      </div>
    </section>
  );
}
