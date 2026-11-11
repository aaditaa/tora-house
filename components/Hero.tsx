import { Reveal } from "@/components/Reveal";

type HeroProps = {
  ctaHref: string;
  ctaLabel: string;
};

/**
 * The four parts of the membership, named together. Each is a section further
 * down, so each is a way in rather than a card.
 */
const MEMBERSHIP = [
  {
    n: "01",
    name: "One curriculum",
    line: "Five disciplines sequenced into a single plan, not six subscriptions.",
    href: "#method",
  },
  {
    n: "02",
    name: "One guide",
    line: "A named guide for the year who knows your history and writes the plan.",
    href: "#guide",
  },
  {
    n: "03",
    name: "Immersions",
    line: "Teachers worth travelling for, brought here instead.",
    href: "#immersions",
  },
  {
    n: "04",
    name: "The room",
    line: "A chapter that meets in person, through the year.",
    href: "#room",
  },
] as const;

/**
 * Full viewport, and it has to stay that way: the point of this screen is that
 * the four parts of the membership are read without scrolling.
 *
 * The lede was seventy words across six sentences and carried nine ideas, which
 * is why nobody got past it. It is one sentence now, and the nine ideas are the
 * four rows underneath, where they can be scanned instead of read.
 *
 * There is no photograph here any more. The cover directly above is a moving
 * full-screen image; a second large one a screen later pushed the four rows off
 * the fold, which is the only thing this section exists to prevent.
 */
export function Hero({ ctaHref, ctaLabel }: HeroProps) {
  return (
    <section
      id="top"
      className="anchor relative min-h-[100svh] pt-28 pb-16 lg:pt-32"
    >
      <div className="shell flex min-h-[calc(100svh-13rem)] flex-col justify-center gap-12 lg:gap-16">
        <div className="grid-12">
          <div className="col-span-12 flex flex-col gap-8 lg:col-span-10">
            <h1 className="t-display">
              <Reveal as="span" className="block" delay={120}>
                A year of practice,
              </Reveal>
              <Reveal as="span" className="block" delay={240}>
                <span className="em-serif">held</span> for you.
              </Reveal>
            </h1>

            <Reveal as="p" className="t-lede max-w-[46ch]" delay={360}>
              A members&rsquo; club for women 40 to 60. One baseline, one plan
              across five disciplines, one guide who holds it, for a year.
            </Reveal>

            <Reveal as="p" className="hero-note" delay={400}>
              A women&rsquo;s club. The panel, the plan and the room are built
              for a woman&rsquo;s body in her forties, fifties and sixties, not
              adapted to it.
            </Reveal>

            <Reveal
              className="flex flex-wrap items-center gap-x-8 gap-y-4"
              delay={460}
            >
              <a href={ctaHref} className="btn btn-primary">
                {ctaLabel}
              </a>
              <a href="#method" className="t-meta link-quiet">
                Read the method
              </a>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:gap-12">
          <Reveal delay={520}>
            <hr className="rule" />
          </Reveal>

          <ul className="grid-12 gap-y-9">
            {MEMBERSHIP.map((m, i) => (
              <Reveal
                as="li"
                key={m.n}
                delay={580 + i * 70}
                className="col-span-12 sm:col-span-6 lg:col-span-3"
              >
                <a href={m.href} className="group flex flex-col gap-2.5">
                  <span className="flex items-baseline gap-3">
                    <span
                      className="t-numeral text-[0.9375rem]"
                      style={{ color: "var(--accent-type)" }}
                    >
                      {m.n}
                    </span>
                    <span className="t-h3 transition-colors duration-200 group-hover:text-brass-text">
                      {m.name}
                    </span>
                  </span>
                  <span className="t-meta text-fg-muted">{m.line}</span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
