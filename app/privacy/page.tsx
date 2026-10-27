import type { Metadata } from "next";

import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { ContactEmail } from "@/components/ContactEmail";
import { BRAND_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${BRAND_NAME} collects through the application and the waitlist, why, and how to have it deleted.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="What we collect, and why."
      updated="{{TBD}}"
    >
      <LegalSection heading="The short version">
        <p className="t-body">
          Two forms on this site collect information: the application and the
          waitlist. Both are read by the small team running {BRAND_NAME}.
          Nothing is sold, nothing is passed to anyone for their own marketing,
          and you can have all of it deleted by sending one email.
        </p>
      </LegalSection>

      <LegalSection heading="If you apply">
        <p className="t-body">
          The application collects your name, email address, WhatsApp number,
          city, age band and what occupies your days; your written answers about
          what you have tried, what interrupts it, roughly what you have spent
          on your health in the last year and what you would want to be true a
          year from now; whether you are training for an event; how you found
          us; how often you could be in the room in person; and anything you add
          in the final box.
        </p>
        <p className="t-body">
          We use it for one thing: to decide whether the founding cohort is
          right for you, and to have an informed conversation with you if it is.
          If you ticked the research box, we may also invite you to a
          twenty-minute conversation about how women manage their health. That
          box is separate, optional, and has no bearing on your application.
        </p>
        <p className="t-body">
          We also record, automatically, when the form was submitted, the
          browser you used, the page that referred you and any campaign
          parameters in the link you arrived through. That is for understanding
          which routes bring the right people, nothing more.
        </p>
      </LegalSection>

      <LegalSection heading="What the application deliberately does not ask">
        <p className="t-body">
          It does not ask your weight, height, measurements or clothing size;
          anything about your diet; any medical condition, diagnosis,
          medication, symptom or menopause status; any mental-health history; or
          your income or net worth. Health data is sensitive personal
          information and has no business sitting in a marketing database before
          you have spoken to anyone. What is clinically relevant is gathered
          later, by the people who need it, in a private consultation held
          appropriately.
        </p>
      </LegalSection>

      <LegalSection heading="If you join the waitlist">
        <p className="t-body">
          The waitlist collects your name, email address, city, an optional line
          of your own and the same technical details described above. It is used
          to write to you when the next cohort opens or when a chapter opens in
          another city. It is not a newsletter and it will not become one.
        </p>
      </LegalSection>

      <LegalSection heading="Where it is stored and who can see it">
        <p className="t-body">
          Both forms write to a managed PostgreSQL database hosted by Neon, in a
          region outside India. The database is reachable only from this
          site&apos;s own server code; there is no public interface to it.
          Access is limited to the people assessing applications — {"{{TBD}}"}{" "}
          named individuals at present.
        </p>
        <p className="t-body">
          Three service providers process this information on our behalf and
          under contract: Neon (database hosting), Resend (sending the
          confirmation and notification emails) and Vercel (hosting this site).
          They may not use it for anything of their own. Nobody else receives
          it. It is not sold, rented or shared for any third party&apos;s
          marketing.
        </p>
      </LegalSection>

      <LegalSection heading="How long it is kept">
        <p className="t-body">
          Applications are kept for {"{{TBD}}"} after the cohort they relate to
          closes, so that we can come back to applicants when a later cohort
          opens. Waitlist entries are kept until you ask to be removed. After
          that, records are deleted rather than archived.
        </p>
      </LegalSection>

      <LegalSection heading="Your consent, and taking it back">
        <p className="t-body">
          Each consent box on this site is unticked by default, asks for one
          thing only, and is never bundled with anything else. Ticking the
          research box is optional and separate from applying.
        </p>
        <p className="t-body">
          You can withdraw consent, ask for a copy of what we hold, correct it,
          or have it deleted, by writing to <ContactEmail />. We will act on it
          within {"{{TBD}}"} working days and confirm when it is done. You do
          not need to give a reason.
        </p>
      </LegalSection>

      <LegalSection heading="Who is responsible">
        <p className="t-body">
          {BRAND_NAME} is the data fiduciary for this information. The contact
          for any question or complaint about it, including under India&apos;s
          Digital Personal Data Protection Act, is <ContactEmail />. The
          registered entity and address are {"{{TBD}}"}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
