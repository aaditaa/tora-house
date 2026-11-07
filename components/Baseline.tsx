import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";

/**
 * The baseline, and the only place it is argued. The Method section used to open
 * with its own "Everything runs on one baseline" block saying the same thing a
 * screen later; the two are one section now.
 *
 * What was cut: a paragraph on three strands, re-reading the panel and dashboards.
 * It was the densest thing on the page, and its "physical, mental and inner
 * practice" did not match the five disciplines the plan is actually written in.
 */
export function Baseline() {
  return (
    <section id="baseline" className="anchor section">
      <div className="shell grid-12 items-start">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-6 lg:pr-10">
          <Reveal>
            <hr className="rule-brass" />
            <p className="t-eyebrow pt-5">The baseline</p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="t-h2">
              It starts with <span className="em-serif">facts</span>.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="t-body">
              A full biomarker panel, read against how Indian bodies respond
              &mdash; your region, your background, your lineage &mdash; rather
              than the imported reference points most labs default to. Your
              guide writes your plan, your routine and the five disciplines from
              that reading, and measures back against it.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className="t-body">
              It is not a clinic you have to brace yourself for. Keep the panel
              as part of your ordinary check-up &mdash; or bring one you have
              already had done, and we will read that against the same reference
              points.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <p className="t-statement max-w-[34ch]">
              Most places begin with a trial session. This one begins with
              evidence.
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
