import Link from "next/link";

import { Board } from "@/components/demo/Board";

const TERMS = [
  {
    numeral: "I",
    title: "What we collect",
    body: "Your answers, your call notes, and your baseline panel. Nothing else.",
  },
  {
    numeral: "II",
    title: "Who sees it",
    body: "Your guide and the clinical practitioner who signs your report. No one else, inside or outside the house.",
  },
  {
    numeral: "III",
    title: "How long we keep it",
    body: "While you are a member, and for one year after. You can ask us to delete it at any time.",
  },
];

/** 02 · Consent. Treatment B, Bone. */
export default function ConsentPage() {
  return (
    <Board ground="bone" style={{ padding: "56px 0 0" }}>
      <div className="flex justify-between" style={{ padding: "16px 24px 0" }}>
        <span className="trk text-[8px]" style={{ color: "var(--deepbrass)" }}>
          Step 1 of 4
        </span>
        <span
          className="trk text-[8px]"
          style={{ color: "rgba(23,33,28,.35)" }}
        >
          Private
        </span>
      </div>

      <div style={{ padding: "16px 24px 0" }}>
        <h1
          className="dp"
          style={{ fontSize: 26, color: "var(--ink)", lineHeight: 1.18 }}
        >
          Before we
          <br />
          <i>begin</i>
        </h1>
        <p className="body" style={{ color: "#5d665f", marginTop: 12 }}>
          Three things, in plain words.
        </p>
      </div>

      <div
        className="flex flex-col"
        style={{ padding: "20px 24px 0", gap: 14 }}
      >
        {TERMS.map((term) => (
          <div
            key={term.numeral}
            style={{
              borderTop: "1px solid rgba(169,132,72,.28)",
              paddingTop: 12,
            }}
          >
            <div className="flex" style={{ gap: 10 }}>
              <span
                className="dp"
                style={{ fontSize: 11, color: "var(--brass)" }}
              >
                {term.numeral}
              </span>
              <div>
                <div style={{ fontSize: 12.5, color: "var(--ink)" }}>
                  {term.title}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: "#6b746c",
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
                  {term.body}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto" style={{ padding: "0 24px 24px" }}>
        <div
          style={{
            background: "rgba(217,205,180,.42)",
            borderRadius: 12,
            padding: "12px 13px",
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 10, color: "#4e574f", lineHeight: 1.5 }}>
            <b style={{ fontWeight: 500 }}>This is not medical advice.</b>{" "}
            Nothing here treats, cures or diagnoses anything, and nothing
            replaces your doctor.
          </p>
        </div>

        <Link href="/demo/survey" className="btn ink">
          I agree
        </Link>
        <p
          className="text-center"
          style={{ fontSize: 9.5, color: "#8d958e", marginTop: 11 }}
        >
          Read the full policy
        </p>
      </div>
    </Board>
  );
}
