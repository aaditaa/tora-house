import { Reveal } from "@/components/Reveal";

/**
 * No imagery, large quiet type on --sand, one paragraph. A woman should recognise
 * herself in it rather than read a demographic description of herself.
 */
export function Problem() {
  return (
    <section className="section bg-sand">
      <div className="shell grid-12">
        <Reveal className="col-span-12 lg:col-span-8 lg:col-start-3">
          <p className="t-statement">
            You have done this before. A trainer who was good, and then moved cities. A plan that
            did not survive a wedding season. Six months of yoga that stopped when work got heavy.
            Each time you began well, and each time nobody was watching closely enough to notice it
            had stopped — or to change the plan instead of waiting for you to come back. Effort was
            never the thing you were short of.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
