import { Questionnaire } from "@/components/Application";
import { Reveal } from "@/components/Reveal";
import { closeDateLabel, isCohortOpen } from "@/lib/config";

/**
 * While the cohort is open this is the primary call to action on the page. Once it
 * closes it collapses to a short honest statement and points down to the waitlist.
 */
export function ApplicationSection() {
  const open = isCohortOpen();

  // The printed brochure carries the questionnaire URL in the footer rule, not the form.
  return (
    <section
      id="apply"
      className="on-sand anchor section bg-surface"
      data-print-hide=""
    >
      <div className="shell grid-12">
        <Reveal className="col-span-12 flex flex-col gap-6 lg:col-span-4">
          <hr className="rule-brass" />
          <p className="t-eyebrow">
            {open ? "The questionnaire" : "Closed for now"}
          </p>
          <h2 className="t-h2">
            {open ? "The questionnaire." : "This cohort is full."}
          </h2>
          {open ? (
            <>
              <p className="t-body text-fg-muted">
                Help us understand what your body needs. It takes about ten
                minutes, and the questions come one after another.
              </p>
              <p className="t-body text-fg-muted">
                It is read by a person, not scored by a form, and everyone who
                sends one hears back within a week.
              </p>
            </>
          ) : (
            <p className="t-body text-fg-muted">
              This cohort closed on {closeDateLabel()}.
            </p>
          )}
        </Reveal>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {open ? (
            <Questionnaire />
          ) : (
            <div className="flex flex-col gap-6">
              <p className="t-statement">
                The next cohort, and the next city, are announced to the
                waitlist first.
              </p>
              <div>
                <a href="#waitlist" className="btn btn-primary">
                  Join the waitlist
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
