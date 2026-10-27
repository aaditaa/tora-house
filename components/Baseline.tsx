import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";

/**
 * The baseline. Text in a left well, the 4:5 image offset right.
 */
export function Baseline() {
  return (
    <section id="baseline" className="anchor section">
      <div className="shell grid-12 items-start">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-6 lg:pr-10">
          <Reveal>
            <hr className="rule-gold" />
            <p className="t-eyebrow pt-5">The baseline</p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="t-h2">
              It starts with <span className="em-serif">facts</span>.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="t-body">
              Before anything is prescribed, you are measured. A full biomarker panel. A movement
              and mobility screen that finds what has quietly stopped working. Sleep, stress and the
              real shape of an ordinary week, mapped. Then an hour sitting down with all of it in
              front of you, read line by line with a person who can explain it.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="t-statement max-w-[34ch]">
              At this price, most places begin with a trial session. This one begins with evidence.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <hr className="rule" />
          </Reveal>

          <Reveal delay={400}>
            <p className="t-body">
              From there, progress is tracked across three strands — physical, mental and inner
              practice — and reviewed every quarter against your own baseline rather than anyone
              else&apos;s. The review is a conversation, not a dashboard you are left to interpret
              alone. A retreat sells a week of feeling. This produces a year of evidence.
            </p>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <Reveal delay={160}>
            <Figure slug="baseline" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
