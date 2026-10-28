import { Reveal } from "@/components/Reveal";
import { Waitlist } from "@/components/Waitlist";
import { BRAND_NAME, isCohortOpen } from "@/lib/config";

/**
 * The second, lighter entry point. Without it, every woman who is interested but not
 * ready — or who is in another city, or who arrives after the cohort has
 * closed — leaves with nothing and is never reachable again.
 */
export function WaitlistBand() {
  const open = isCohortOpen();

  return (
    <section
      id="waitlist"
      className="on-sand anchor bg-surface"
      data-print-hide=""
    >
      <div
        className={`shell flex flex-col gap-10 ${open ? "py-20" : "section"}`}
      >
        <Reveal className="flex flex-col gap-4">
          <hr className="rule-brass" />
          <p className="t-eyebrow">The waitlist</p>
          <h2 className="t-h2">Join the waitlist.</h2>
          <p className="t-body text-fg-muted">
            Leave your name and we will send you more about {BRAND_NAME} — what
            a year holds, how the chapters work, and word when the next cohort
            opens or a chapter opens in a new city.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Waitlist source={open ? "band-open" : "band-closed"} />
        </Reveal>
      </div>
    </section>
  );
}
