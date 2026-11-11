import { Reveal } from "@/components/Reveal";

/**
 * No imagery, quiet type on --sand, one line.
 *
 * This held a seven-sentence paragraph about trainers who moved cities and
 * plans that did not survive a wedding season. It is one sentence now, set
 * smaller and on a narrower measure than the statements elsewhere — the point
 * lands faster than the paragraph did, and it should not read as a headline.
 */
export function Problem() {
  return (
    <section className="on-sand section section-tight bg-surface">
      <div className="shell grid-12">
        <Reveal className="col-span-12 lg:col-span-6 lg:col-start-4">
          <p className="t-h3 max-w-[22ch]">
            Men have had their clubs for years.{" "}
            <span className="em-serif">This one is for you.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
