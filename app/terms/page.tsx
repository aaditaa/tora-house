import Link from "next/link";

import type { Metadata } from "next";

import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { ContactEmail } from "@/components/ContactEmail";
import { BRAND_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms on which this site and the ${BRAND_NAME} application work.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="Terms" title="Terms of use." updated="{{TBD}}">
      <LegalSection heading="This site">
        <p className="t-body">
          This page describes a membership and invites applications to it.
          Everything on it is offered in good faith and may change as the
          founding cohort is formed. Nothing here is medical advice, and nothing
          here is a diagnosis, a treatment or a promise about any outcome.
        </p>
      </LegalSection>

      <LegalSection heading="Applying is not joining">
        <p className="t-body">
          Submitting the application does not create a membership and does not
          oblige either of us to anything. We read every application and reply
          either way. Places in the founding cohort are limited and may be
          filled before a given application is read.
        </p>
      </LegalSection>

      <LegalSection heading="Membership terms">
        <p className="t-body">
          The full terms of membership — fees, what is included, the length of
          the commitment, cancellation and refunds, the conduct expected inside
          a chapter, and what happens if a member moves city — are set out in
          the membership agreement, which is given to you in full before any
          payment is taken. Those terms are {"{{TBD}}"} and are not summarised
          here, because a summary of a contract is worse than the contract.
        </p>
      </LegalSection>

      <LegalSection heading="Your information">
        <p className="t-body">
          What this site collects and how it is handled is set out in the{" "}
          <Link href="/privacy" className="link">
            privacy note
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Governing law and contact">
        <p className="t-body">
          These terms are governed by the laws of India. The registered entity,
          its address and the jurisdiction for any dispute are {"{{TBD}}"}.
          Questions go to <ContactEmail />.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
