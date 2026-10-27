import { Reveal } from "@/components/Reveal";
import { Waitlist } from "@/components/Waitlist";
import { CITY, isCohortOpen } from "@/lib/config";

/**
 * The second, lighter entry point. Without it, every woman who is interested but not
 * ready — or who is in Delhi rather than {CITY}, or who arrives after the cohort has
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
          {open ? (
            <h2 className="t-h3">Not this cohort.</h2>
          ) : (
            <h2 className="t-h2">Be told first.</h2>
          )}
          <p className="t-body text-fg-muted">
            {open
              ? `If you are not ready yet, or you are in another city, leave your name. You will hear when the next cohort or the next chapter outside ${CITY} opens. Nothing else is sent.`
              : `Leave your name and you will hear when the next cohort or the next chapter outside ${CITY} opens. Nothing else is sent — this does not become a mailing list.`}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Waitlist source={open ? "band-open" : "band-closed"} />
        </Reveal>
      </div>
    </section>
  );
}
