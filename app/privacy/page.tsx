import type { Metadata } from "next";

import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { ContactEmail } from "@/components/ContactEmail";
import { BRAND_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${BRAND_NAME} collects through the waitlist, immersion bookings and Meta's pixel, why, and how to have it deleted.`,
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
          Two forms on this site collect information: the waitlist and the
          booking form for an immersion. Both are read by the small team running{" "}
          {BRAND_NAME}. A questionnaire that used to be here has been taken
          down; what was sent through it is still held, and is described below.
          The site also runs Meta&apos;s pixel on every page, to measure our ads
          on Facebook and Instagram; what Meta receives is set out below.
          Nothing is sold, and you can have everything we hold deleted by
          sending one email.
        </p>
      </LegalSection>

      <LegalSection heading="If you join the waitlist">
        <p className="t-body">
          The waitlist collects your name, email address, city and an optional
          line of your own. It is used to write to you when the next cohort
          opens or when a chapter opens in another city. It is not a newsletter
          and it will not become one.
        </p>
      </LegalSection>

      <LegalSection heading="If you book a seat at an immersion">
        <p className="t-body">
          The booking form collects your name and email address, a phone number
          if you choose to give one, how many seats you want, whether you are a
          member, and two optional lines: anything we should know about food,
          and how you heard about the session. We also keep the amount, where
          the booking stands (requested, paid or cancelled), and Razorpay&apos;s
          references for your payment link and payment.
        </p>
        <p className="t-body">
          We use it to hold your seats, to send you a confirmation and the way
          to pay, and to reach you about that session if something changes. The
          phone number is only for the day itself. The food line is used to lay
          the table and for nothing else. Booking a seat does not add you to the
          waitlist or to anything else.
        </p>
        <p className="t-body">
          Payment is taken on Razorpay&apos;s own page, never on this site. To
          make your payment link, we send Razorpay your name, email address,
          phone number if you gave one, and the amount, so the page is filled in
          for you; Razorpay also emails you the link, and texts it if you gave a
          number. We do not see or store your card or bank details. What you
          enter on Razorpay&apos;s page is covered by Razorpay&apos;s own
          privacy policy. Maison de Medusa, the studio hosting the session,
          receives {"{{TBD}}"}.
        </p>
      </LegalSection>

      <LegalSection heading="If you answered the questionnaire">
        <p className="t-body">
          Until 22 November 2026 this site carried a questionnaire. It has been
          taken down and nothing new is collected through it, but the answers
          already sent are still held. It collected your age band and city; what
          you were drawn to and what you practised; how you mostly worked out;
          roughly what you had spent on your health in the previous twelve
          months; three written answers, being what you had tried, what got in
          the way when something stopped, and what you wanted to be true a year
          on; and how to reach you.
        </p>
        <p className="t-body">
          From 28 October 2026 it required an email address and asked for a
          phone number if you wanted to give one. It never asked for your name.
          Before then it could be sent without an address, and answers sent that
          way are held without anything that identifies you. Nothing has been
          sent to them and nothing will be.
        </p>
        <p className="t-body">
          We use these answers for one thing: to come back to you about them.
          The box labelled &ldquo;I&rsquo;m interested to hear more about
          this&rdquo; was a separate question and started unticked. If you left
          it alone, we will not write to you beyond that reply.
        </p>
      </LegalSection>

      <LegalSection heading="What we record without asking">
        <p className="t-body">
          With each form we record when it was sent, the page that referred you
          and any campaign parameters in the link you arrived through, including
          Meta&apos;s ad click identifier if you came from one of our ads. With
          a booking we also keep Meta&apos;s two browser identifiers, described
          below, so that a payment can be matched to the ad that led to it. That
          is for understanding which routes bring the right people, nothing
          more. The questionnaire also recorded which browser you used.
        </p>
        <p className="t-body">
          To stop automated sign-ups, the server counts how many forms have come
          from one network address in the last hour. That count is held in
          memory and discarded; the address is never written to the database.
        </p>
      </LegalSection>

      <LegalSection heading="What none of these forms asks">
        <p className="t-body">
          None of them asks your weight, height, measurements or clothing size;
          any medical condition, diagnosis, medication, symptom or menopause
          status; any mental-health history; or your income or net worth. Health
          data is sensitive personal information and has no business sitting in
          a marketing database before you have spoken to anyone. What is
          clinically relevant is gathered later, by the people who need it, in a
          private consultation held appropriately.
        </p>
      </LegalSection>

      <LegalSection heading="Meta, and our ads">
        <p className="t-body">
          Every page on this site loads Meta&apos;s pixel, for every visitor. It
          tells Meta which pages you open here and when you see the immersion,
          open the booking form, reach the payment step, pay, or join the
          waitlist, with the amount where there is one. With that go your
          browser and device details, your IP address and Meta&apos;s own
          identifiers for your browser.
        </p>
        <p className="t-body">
          When you join the waitlist, book a seat or pay, our server also sends
          Meta the same event directly, with your email address, phone number if
          you gave one, and first name, each scrambled (SHA-256 hashed) before
          it leaves us. Meta uses the scrambled values to match the visit to a
          Meta account, so we can see which ads bring people who book.
        </p>
        <p className="t-body">
          We use this to measure and improve our ads. What Meta does with it is
          governed by Meta&apos;s own terms and privacy policy, not ours. You
          can see and disconnect this activity in your Meta account under
          &ldquo;Your activity off Meta technologies&rdquo;, and you can stop
          the pixel by blocking third-party cookies or using a tracker blocker
          in your browser.
        </p>
      </LegalSection>

      <LegalSection heading="What this site keeps in your browser">
        <p className="t-body">
          Meta&apos;s pixel sets two cookies: _fbp, which identifies your
          browser to Meta for up to ninety days, and, if you arrived from one of
          our ads, _fbc, which records that click for up to ninety days. There
          are no other cookies and no analytics of our own.
        </p>
        <p className="t-body">
          A few small notes are kept in your own browser and never sent to us:
          that you closed the announcement strip; that you closed the
          invitation, for thirty days; the campaign parameters of the page you
          arrived on and, until you close the tab, whether you have already
          joined or booked, so that you are not asked again. The demo keeps its
          invented data in your browser so that a reload does not lose your
          place. Clearing your browser&apos;s site data removes all of it.
        </p>
      </LegalSection>

      <LegalSection heading="Where it is stored and who can see it">
        <p className="t-body">
          Everything the forms collect is written to a managed PostgreSQL
          database hosted by Neon, in a region outside India. The database is
          reachable only from this site&apos;s own server code; there is no
          public interface to it. Access is limited to the people reading the
          answers: {"{{TBD}}"} named individuals at present.
        </p>
        <p className="t-body">
          Four service providers process this information on our behalf and
          under contract: Neon (database hosting), Resend (sending the
          confirmation and notification emails), Vercel (hosting this site) and
          Razorpay (taking payment for immersions). They may not use it for
          anything of their own. Apart from them, Meta, as described above, and
          what is described above for an immersion, nobody else receives it. It
          is not sold or rented to anyone.
        </p>
      </LegalSection>

      <LegalSection heading="How long it is kept">
        <p className="t-body">
          Questionnaire answers are kept for {"{{TBD}}"} after the cohort they
          relate to closes, so that we can come back to the people who sent them
          when a later cohort opens. Immersion bookings are kept for {"{{TBD}}"}{" "}
          after the session. Waitlist entries are kept until you ask to be
          removed. After that, records are deleted rather than archived.
        </p>
      </LegalSection>

      <LegalSection heading="Your consent, and taking it back">
        <p className="t-body">
          There are no pre-ticked boxes on this site. Joining the waitlist is
          itself the request to hear from us, and the line beside its button
          says so. Booking a seat is a request for that seat and nothing more.
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
