import type { Metadata } from "next";
import Link from "next/link";

import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { BRAND_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${BRAND_NAME} is called what it is, and why it exists: Indian longevity lineage and vetted global practice held in one place, on a baseline read against Indian reference points.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${BRAND_NAME}`,
  },
};

export default function AboutPage() {
  return (
    <LegalLayout eyebrow="About" title="Why the name, and why this exists.">
      <LegalSection heading="Why the name">
        <p className="t-body">
          A torana is the carved stone gateway that stands at the entrance to a
          temple. The ones at Sanchi have been standing for two thousand years.
          It is not the building, and it was never meant to be — it is the line
          between outside and in, and the thing you pass through in order to
          belong.
        </p>
        <p className="t-body">
          We kept the gateway and shortened the rest. {BRAND_NAME} marks the
          moment you decide, and then walks the rest of it with you.
        </p>
      </LegalSection>

      <LegalSection heading="Why this exists">
        <p className="t-body">
          A trainer who was good, and then moved cities. A plan that did not
          survive a wedding season. Six months of yoga that stopped when work
          got heavy. None of that is a failure of effort. Effort was never the
          thing in short supply — continuity was.
        </p>
        <p className="t-body">
          The money is already being spent, too. It goes to a trainer, a
          physiotherapist, a nutritionist, a dermatologist, a studio membership,
          a retreat — providers who do not speak to one another, none of whom
          holds the whole picture, and none of whom notices when something
          stops.
        </p>
        <p className="t-body">
          So this holds both halves in one place: the Indian longevity lineage
          that was already here, and the global practice worth importing, each
          one vetted before it reaches you. And it starts from a baseline of
          your own biomarkers, read against Indian reference points rather than
          imported ones. That sentence is the whole of the claim in our line —
          longevity, as India knew it first — and it is either true of the panel
          on the table or it is marketing.
        </p>
      </LegalSection>

      <LegalSection heading="Who’s behind it">
        {/* FOUNDER BIO — Aaditaa to supply. Do not write copy here. */}
      </LegalSection>

      <LegalSection heading="If this is your room">
        <p className="t-body">
          The questionnaire takes about ten minutes, and the questions come one
          after another. It is read by a person, not scored by a form, and
          everyone who sends one hears back within a week.
        </p>
        <p>
          <Link href="/#apply" className="btn btn-primary">
            Start the questionnaire
          </Link>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
